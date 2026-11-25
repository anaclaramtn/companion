package com.companion.firebase;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Quando uma conta é excluída, apaga também o cadastro no Firebase (LGPD).
 * Só roda depois do commit: se o banco falhar, a conta do Firebase fica intacta.
 */
@Component
public class FirebaseAccountDeletionListener {

    private static final Logger log = LoggerFactory.getLogger(FirebaseAccountDeletionListener.class);

    private final FirebaseGateway firebaseGateway;

    public FirebaseAccountDeletionListener(FirebaseGateway firebaseGateway) {
        this.firebaseGateway = firebaseGateway;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onAccountDeleted(FirebaseAccountDeletedEvent event) {
        try {
            firebaseGateway.deleteUser(event.firebaseUid());
        } catch (RuntimeException exception) {
            log.error("A conta foi excluída no banco, mas não no Firebase. Exclua manualmente o UID {}",
                    event.firebaseUid(), exception);
        }
    }
}
