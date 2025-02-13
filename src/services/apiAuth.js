import supabase, { supabaseUrl } from "./supabase";

// Funcție pentru înregistrare (signup) utilizator
export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });
  // Nu returnăm nimic explicit, dar eroarea va fi aruncată dacă apare
}

// Funcție pentru autentificare (login) utilizator
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data; // Returnăm datele utilizatorului autentificat
}

// Funcție pentru a obține utilizatorul curent
export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null; // Dacă nu există sesiune activă, returnăm null
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message); // Aruncăm eroarea dacă apare

  return data?.user; // Returnăm datele utilizatorului curent
}

// Funcție pentru deconectarea utilizatorului (logout)
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

// Funcție pentru actualizarea datelor utilizatorului curent
export async function updateCurrentUser({ password, fullName, avatar }) {
  // 1. Actualizăm parola sau numele complet al utilizatorului
  let updateData;
  if (password) updateData = { password }; // Dacă există o parolă, actualizăm parola
  if (fullName) updateData = { data: { fullName } }; // Dacă există un nume complet, actualizăm numele

  const { data, error } = await supabase.auth.updateUser(updateData);
  if (error) throw new Error(error.message);
  if (!avatar) return data; // Dacă nu avem avatar, returnăm utilizatorul actualizat

  // 2. Dacă există un avatar, încărcăm imaginea avatarului
  const fileName = `avatar-${data.user.id}-${Math.random()}`; // Generăm un nume unic pentru fișier
  const { error: storageError } = await supabase.storage
    .from("avatars") // Specificăm  din Supabase Storage
    .upload(fileName, avatar);
  if (storageError) throw new Error(storageError.message);

  // 3. Actualizăm avatarul în datele utilizatorului
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars//${fileName}`, // URL-ul public al avatarului încărcat
    },
  });
  if (error2) throw new Error(error2.message);
  return updatedUser; // Returnăm utilizatorul actualizat cu avatarul
}
