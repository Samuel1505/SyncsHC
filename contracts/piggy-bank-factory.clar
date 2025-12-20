;; title: PiggyBankFactory
;; version: 1.0.0
;; summary: Factory contract to register and track PiggyBank contracts
;; description: Allows users to register their PiggyBank contracts. Users deploy PiggyBank contracts separately and register them here.

(define-constant ERR-UNAUTHORIZED (err u2001))
(define-constant ERR-ALREADY-REGISTERED (err u2002))
(define-constant ERR-NOT-REGISTERED (err u2003))

;; Data maps
(define-map user-piggy-banks { user: principal } (list 10 principal))
(define-map piggy-bank-owners { piggy-bank: principal } principal)
(define-data-var total-piggy-banks uint u0)

;; Public functions

;; Register a PiggyBank contract (must be called by the piggy bank owner)
(define-public (register-piggy-bank (piggy-bank principal))
    (begin
        ;; Check if already registered
        (let ((existing-owner (map-get? piggy-bank-owners { piggy-bank: piggy-bank })))
            (asserts! (is-none existing-owner) ERR-ALREADY-REGISTERED)
        )
        
        ;; Register the piggy bank
        (let ((existing-list (default-to (list) (map-get? user-piggy-banks { user: tx-sender }))))
            (let ((new-list (append existing-list (list piggy-bank))))
                (if (is-ok new-list)
                    (map-set user-piggy-banks { user: tx-sender } (unwrap-panic new-list))
                    (map-set user-piggy-banks { user: tx-sender } (list piggy-bank))
                )
            )
        )
        (map-set piggy-bank-owners { piggy-bank: piggy-bank } tx-sender)
        (var-set total-piggy-banks (+ (var-get total-piggy-banks) u1))
        (ok true)
    )
)

;; Unregister a PiggyBank contract (only owner)
(define-public (unregister-piggy-bank (piggy-bank principal))
    (let ((owner (map-get? piggy-bank-owners { piggy-bank: piggy-bank })))
        (asserts! (is-some owner) ERR-NOT-REGISTERED)
        (asserts! (is-eq tx-sender (unwrap-panic owner)) ERR-UNAUTHORIZED)
        (map-delete piggy-bank-owners { piggy-bank: piggy-bank })
        (var-set total-piggy-banks (- (var-get total-piggy-banks) u1))
        (ok true)
    )
)

;; Read-only functions

;; Get all piggy banks for a user
(define-read-only (get-user-piggy-banks (user principal))
    (ok (default-to (list) (map-get? user-piggy-banks { user: user })))
)

;; Get the owner of a piggy bank
(define-read-only (get-piggy-bank-owner (piggy-bank principal))
    (ok (map-get? piggy-bank-owners { piggy-bank: piggy-bank }))
)

;; Check if a principal is a registered piggy bank contract
(define-read-only (is-piggy-bank (contract principal))
    (ok (is-some (map-get? piggy-bank-owners { piggy-bank: contract })))
)

;; Get total number of registered piggy banks
(define-read-only (get-total-piggy-banks)
    (ok (var-get total-piggy-banks))
)

