package com.companion.firebase;

/** Publicado quando uma conta ligada ao Firebase é excluída no Companion. */
public record FirebaseAccountDeletedEvent(String firebaseUid) {
}
