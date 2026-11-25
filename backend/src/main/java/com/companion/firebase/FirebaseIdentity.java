package com.companion.firebase;

/** Quem a pessoa é segundo o Firebase, lido de um ID token já validado. */
public record FirebaseIdentity(String uid, String email, boolean emailVerified) {
}
