;; title: PiggyBankFactory
;; version: 1.0.0
;; summary: Factory contract to deploy individual PiggyBank contracts
;; description: Allows users to create and deploy their own PiggyBank savings accounts

(define-constant ERR-UNAUTHORIZED (err u2001))
(define-constant ERR-DEPLOY-FAILED (err u2002))

;; Data maps
(define-map user-piggy-banks { user: principal } (list 10 principal))
(define-map piggy-bank-owners { piggy-bank: principal } principal)

;; Public functions

;; Deploy a new PiggyBank contract for the caller
(define-public (create-piggy-bank)
    (begin
        ;; Generate a unique contract name based on sender and block height
        (let ((contract-name (format "piggy-bank-{}-{}" tx-sender block-height)))
            ;; Deploy the contract
            (match (try! (contract-deployer? piggy-bank contract-name))
                (ok contract-principal)
                    (begin
                        ;; Register the piggy bank
                        (let ((existing-list (default-to (list) (map-get? user-piggy-banks { user: tx-sender }))))
                            (map-set user-piggy-banks { user: tx-sender } (append existing-list (list contract-principal)))
                        )
                        (map-set piggy-bank-owners { piggy-bank: contract-principal } tx-sender)
                        (ok contract-principal)
                    )
                (err e) (err ERR-DEPLOY-FAILED)
            )
        )
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

;; Check if a principal is a piggy bank contract
(define-read-only (is-piggy-bank (contract principal))
    (ok (is-some (map-get? piggy-bank-owners { piggy-bank: contract })))
)

