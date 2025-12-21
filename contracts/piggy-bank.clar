;; title: PiggyBank
;; version: 1.0.0
;; summary: Individual savings account with lock duration and penalty fees
;; description: Allows users to deposit supported tokens and withdraw after lock period. Early withdrawals incur a penalty fee.

(define-constant ERR-UNAUTHORIZED (err u1001))
(define-constant ERR-INVALID-AMOUNT (err u1002))
(define-constant ERR-LOCK-NOT-EXPIRED (err u1003))
(define-constant ERR-NO-BALANCE (err u1004))
(define-constant ERR-INVALID-TOKEN (err u1005))
(define-constant ERR-TRANSFER-FAILED (err u1006))

(define-constant PENALTY-RATE u50) ;; 5% penalty (50 basis points = 5%)

;; Data vars
(define-data-var contract-principal (optional principal) none)

;; Data maps
(define-map balances { token: principal, owner: principal } uint)
(define-map lock-info { owner: principal } { 
    lock-duration: uint,
    lock-start: uint,
    token: principal
})

;; Public functions

;; Deposit STX into the piggy bank
(define-public (deposit-stx (amount uint))
    (let ((sender tx-sender))
        (begin
            ;; Initialize contract principal if needed (use sender as marker for first call)
            (if (is-none (var-get contract-principal))
                (var-set contract-principal (some sender))
                true
            )
            
            ;; Verify amount is greater than 0
            (asserts! (> amount u0) ERR-INVALID-AMOUNT)
            
            ;; Get STX marker
            (let ((stx-marker (unwrap-panic (var-get contract-principal))))
                ;; Check if lock already exists
                (let ((existing-lock (map-get? lock-info { owner: sender })))
                    (if existing-lock
                        ;; If lock exists, verify it's STX
                        (asserts! (is-eq (get token (unwrap-panic existing-lock)) stx-marker) ERR-INVALID-TOKEN)
                        ;; If no lock exists, create one
                        (map-set lock-info { owner: sender } {
                            lock-duration: u0,
                            lock-start: block-height,
                            token: stx-marker
                        })
                    )
                )
                
                ;; Transfer STX from sender to this contract
                ;; Note: User must send STX as part of the transaction
                ;; The contract receives STX automatically when the function is called with STX
                (begin
                    ;; Update balance (use contract principal as token identifier for STX)
                    (let ((current-balance (default-to u0 (map-get? balances { token: stx-marker, owner: sender }))))
                        (map-set balances { token: stx-marker, owner: sender } (+ current-balance amount))
                    )
                    (ok true)
                )
            )
        )
    )
)

;; Deposit fungible tokens into the piggy bank
(define-public (deposit-token (amount uint) (token principal))
    (let ((sender tx-sender))
        (begin
            ;; Verify amount is greater than 0
            (asserts! (> amount u0) ERR-INVALID-AMOUNT)
            
            ;; Check if lock already exists
            (let ((existing-lock (map-get? lock-info { owner: sender })))
                (if existing-lock
                    ;; If lock exists, verify it's the same token
                    (asserts! (is-eq (get token (unwrap-panic existing-lock)) token) ERR-INVALID-TOKEN)
                    ;; If no lock exists, create one
                    (map-set lock-info { owner: sender } {
                        lock-duration: u0,
                        lock-start: block-height,
                        token: token
                    })
                )
            )
            
            ;; Transfer tokens from sender to this contract
            ;; Note: For fungible tokens, the user must approve this contract first
            (match (contract-call? token transfer amount sender tx-sender)
                (ok true)
                    (begin
                        ;; Update balance
                        (let ((current-balance (default-to u0 (map-get? balances { token: token, owner: sender }))))
                            (map-set balances { token: token, owner: sender } (+ current-balance amount))
                        )
                        (ok true)
                    )
                (err e) (err ERR-TRANSFER-FAILED)
            )
        )
    )
)

;; Set lock duration (can only be set once, before first deposit)
(define-public (set-lock-duration (duration uint))
    (let ((lock (map-get? lock-info { owner: tx-sender })))
        (if lock
            (let ((balance (default-to u0 (map-get? balances { 
                token: (get token (unwrap-panic lock)), 
                owner: tx-sender 
            }))))
                ;; Can only set lock duration if no balance exists
                (asserts! (is-eq balance u0) ERR-UNAUTHORIZED)
                (map-set lock-info { owner: tx-sender } {
                    lock-duration: duration,
                    lock-start: (get lock-start (unwrap-panic lock)),
                    token: (get token (unwrap-panic lock))
                })
                (ok true)
            )
            (err ERR-UNAUTHORIZED)
        )
    )
)

;; Withdraw tokens from the piggy bank
(define-public (withdraw (amount uint))
    (let ((sender tx-sender)
          (lock (map-get? lock-info { owner: tx-sender })))
        (asserts! (is-some lock) ERR-UNAUTHORIZED)
        
        (let ((lock-data (unwrap-panic lock))
              (token (get token lock-data))
              (lock-start (get lock-start lock-data))
              (lock-duration (get lock-duration lock-data))
              (current-balance (default-to u0 (map-get? balances { token: token, owner: sender }))))
            
            ;; Verify amount is valid
            (asserts! (> amount u0) ERR-INVALID-AMOUNT)
            (asserts! (<= amount current-balance) ERR-NO-BALANCE)
            
            ;; Calculate if lock period has expired
            (let ((current-height block-height)
                  (elapsed (- current-height lock-start))
                  (is-locked (< elapsed lock-duration)))
                
                (let ((withdraw-amount (if is-locked
                        ;; Calculate penalty for early withdrawal
                        (let ((penalty-amount (/ (* amount PENALTY-RATE) u1000)))
                            (- amount penalty-amount)
                        )
                        ;; No penalty if lock period expired
                        amount
                    )))
                    
                    ;; Update balance
                    (map-set balances { token: token, owner: sender } (- current-balance amount))
                    
                    ;; Transfer tokens back to user (handle STX vs fungible tokens)
                    (let ((stx-marker (unwrap-panic (var-get contract-principal))))
                        (if (is-eq token stx-marker)
                            ;; STX transfer from contract to user
                            (match (as-contract (stx-transfer? withdraw-amount tx-sender sender))
                                (ok true) (ok withdraw-amount)
                                (err e) (err ERR-TRANSFER-FAILED)
                            )
                            ;; Fungible token transfer from contract to user
                            (match (as-contract (contract-call? token transfer withdraw-amount tx-sender sender))
                                (ok true) (ok withdraw-amount)
                                (err e) (err ERR-TRANSFER-FAILED)
                            )
                        )
                    )
                )
            )
        )
    )
)

;; Read-only functions

;; Get balance for a user and token
(define-read-only (get-balance (token principal) (owner principal))
    (ok (default-to u0 (map-get? balances { token: token, owner: owner })))
)

;; Get lock information for a user
(define-read-only (get-lock-info (owner principal))
    (ok (map-get? lock-info { owner: owner }))
)

;; Check if lock period has expired
(define-read-only (is-lock-expired (owner principal))
    (let ((lock (map-get? lock-info { owner: owner })))
        (if lock
            (let ((lock-data (unwrap-panic lock))
                  (lock-start (get lock-start lock-data))
                  (lock-duration (get lock-duration lock-data))
                  (elapsed (- block-height lock-start)))
                (ok (>= elapsed lock-duration))
            )
            (ok false)
        )
    )
)

;; Get remaining lock blocks
(define-read-only (get-remaining-lock-blocks (owner principal))
    (let ((lock (map-get? lock-info { owner: owner })))
        (if lock
            (let ((lock-data (unwrap-panic lock))
                  (lock-start (get lock-start lock-data))
                  (lock-duration (get lock-duration lock-data))
                  (elapsed (- block-height lock-start)))
                (if (>= elapsed lock-duration)
                    (ok u0)
                    (ok (- lock-duration elapsed))
                )
            )
            (ok u0)
        )
    )
)

