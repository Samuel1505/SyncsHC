;; title: PiggyBankRegistry
;; version: 1.0.0
;; summary: Registry to track all deployed PiggyBank instances
;; description: Maintains a centralized registry of all PiggyBank contracts and their metadata

(define-constant ERR-UNAUTHORIZED (err u4001))
(define-constant ERR-ALREADY-REGISTERED (err u4002))
(define-constant ERR-NOT-REGISTERED (err u4003))
(define-constant ERR-LIST-FULL (err u4004))
(define-constant ERR-INVALID-INPUT (err u4005))

;; Data maps
(define-map piggy-bank-metadata { piggy-bank: principal } {
    owner: principal,
    created-at: uint,
    factory: principal
})
(define-map owner-piggy-banks { owner: principal } (list 10 principal))
(define-map all-piggy-banks uint principal) ;; Index-based map for enumeration
(define-data-var total-piggy-banks uint u0)

;; Helper function to add piggy bank to list
(define-private (add-to-list (piggy-bank principal) (existing-list (list 10 principal)))
    (unwrap-panic (as-max-len? (append existing-list piggy-bank) u10))
)

;; Public functions

;; Register a new piggy bank (can be called by factory or piggy bank itself)
(define-public (register-piggy-bank (piggy-bank principal) (owner principal) (factory principal))
    (let ((current-block u0)) ;; TODO: Replace with block-height when available in Clarity 4
        (begin
            (asserts! (not (is-eq piggy-bank tx-sender)) ERR-INVALID-INPUT)
            (asserts! (not (is-eq owner tx-sender)) ERR-INVALID-INPUT)
            (asserts! (not (is-eq factory tx-sender)) ERR-INVALID-INPUT)
            ;; Check if already registered
            (let ((existing (map-get? piggy-bank-metadata { piggy-bank: piggy-bank })))
                (asserts! (is-none existing) ERR-ALREADY-REGISTERED)
            )
            
            ;; Register metadata
            (map-set piggy-bank-metadata { piggy-bank: piggy-bank } {
                owner: owner,
                created-at: current-block,
                factory: factory
            })
        
            ;; Add to owner's list
            (let ((owner-list (default-to (list) (map-get? owner-piggy-banks { owner: owner }))))
                (map-set owner-piggy-banks { owner: owner } (add-to-list piggy-bank owner-list))
            )
        
            ;; Add to global registry
            (let ((index (var-get total-piggy-banks)))
                (map-set all-piggy-banks index piggy-bank)
                (var-set total-piggy-banks (+ index u1))
            )
            
            (ok true)
        )
    )
)

;; Unregister a piggy bank (only owner)
(define-public (unregister-piggy-bank (piggy-bank principal))
    (begin
        (asserts! (not (is-eq piggy-bank tx-sender)) ERR-INVALID-INPUT)
        (let ((metadata (map-get? piggy-bank-metadata { piggy-bank: piggy-bank })))
            (asserts! (is-some metadata) ERR-NOT-REGISTERED)
            (let ((data (unwrap-panic metadata)))
                (asserts! (is-eq tx-sender (get owner data)) ERR-UNAUTHORIZED)
                (map-delete piggy-bank-metadata { piggy-bank: piggy-bank })
                (ok true)
            )
        )
    )
)

;; Read-only functions

;; Get metadata for a piggy bank
(define-read-only (get-piggy-bank-metadata (piggy-bank principal))
    (ok (map-get? piggy-bank-metadata { piggy-bank: piggy-bank }))
)

;; Get all piggy banks for an owner
(define-read-only (get-owner-piggy-banks (owner principal))
    (ok (default-to (list) (map-get? owner-piggy-banks { owner: owner })))
)

;; Get total number of registered piggy banks
(define-read-only (get-total-piggy-banks)
    (ok (var-get total-piggy-banks))
)

;; Get piggy bank by index
(define-read-only (get-piggy-bank-by-index (index uint))
    (ok (map-get? all-piggy-banks index))
)