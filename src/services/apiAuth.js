import supabase from "./supabase";

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function signUp({ fullName, email, password }) {
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

  let authError = null;

  // User exists, but is fake. See https://supabase.com/docs/reference/javascript/auth-signup
  if (data?.user && !data.user?.identities.length) {
    authError = {
      name: "AuthApiError",
      message: "This email has already been registered",
    };
  } else if (error) {
    authError = {
      name: error.name,
      message: error.message,
    };
  }

  if (authError) throw new Error(authError.message);

  return data;
}

export async function getUser() {
  const { data: session, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError) throw new Error("Login error", { cause: sessionError });
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

export async function updateUser({ fullName, avatar, password }) {
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) throw new Error(error.message);
  if (!avatar) return data;

  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError) throw new Error(storageError.message);

  const { data: updatedUser, error: updatedError } =
    await supabase.auth.updateUser({
      data: {
        avatar: `https://qhlgvfbcyomfxbcrgclw.supabase.co/storage/v1/object/public/avatars/${fileName}`,
      },
    });

  if (updatedError) throw new Error(updatedError.message);
  return { updatedUser };
}
