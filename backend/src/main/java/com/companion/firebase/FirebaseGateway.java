package com.companion.firebase;

/**
 * Tudo o que o backend pede ao Firebase Authentication. É uma interface para
 * os testes rodarem sem credenciais e sem chamar o Firebase de verdade.
 */
public interface FirebaseGateway {

    /**
     * Confere o ID token enviado pelo frontend (assinatura, validade, projeto e
     * se a sessão não foi revogada). Lança BadCredentialsException se não valer.
     */
    FirebaseIdentity verify(String idToken);

    /** Apaga a conta no Firebase. Não falha se ela já não existir. */
    void deleteUser(String uid);

    /**
     * Cria uma conta com e-mail já verificado, se ainda não existir.
     * Usado só pelos dados de exemplo. Devolve true quando criou.
     */
    boolean createVerifiedUserIfMissing(String email, String password, String displayName);
}
