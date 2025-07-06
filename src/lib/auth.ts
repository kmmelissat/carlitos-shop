import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import {
  User,
  AuthUser,
  RegisterFormData,
  LoginFormData,
  UserRole,
} from "@/types";

// Registro de usuario
export const registerUser = async (
  userData: RegisterFormData
): Promise<AuthUser> => {
  try {
    const { email, password, name, phone } = userData;

    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;

    // Actualizar perfil con nombre
    await updateProfile(firebaseUser, {
      displayName: name,
    });

    // Crear documento de usuario en Firestore (siempre como USER)
    const userDoc: User = {
      id: firebaseUser.uid,
      email,
      name,
      phone,
      role: UserRole.USER, // Siempre USER por defecto
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "users", firebaseUser.uid), userDoc);

    return {
      id: firebaseUser.uid,
      email,
      name,
      role: UserRole.USER,
      isVerified: false,
    };
  } catch (error: any) {
    throw new Error(error.message || "Error al registrar usuario");
  }
};

// Login de usuario
export const loginUser = async (
  credentials: LoginFormData
): Promise<AuthUser> => {
  try {
    const { email, password } = credentials;

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;

    // Obtener datos adicionales del usuario desde Firestore
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

    if (!userDoc.exists()) {
      throw new Error("Usuario no encontrado");
    }

    const userData = userDoc.data() as User;

    return {
      id: firebaseUser.uid,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
      role: userData.role,
      isVerified: userData.isVerified,
    };
  } catch (error: any) {
    throw new Error(error.message || "Error al iniciar sesión");
  }
};

// Cerrar sesión
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || "Error al cerrar sesión");
  }
};

// Restablecer contraseña
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(
      error.message || "Error al enviar email de restablecimiento"
    );
  }
};

// Obtener usuario actual
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      return null;
    }

    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data() as User;

    return {
      id: firebaseUser.uid,
      email: userData.email,
      name: userData.name,
      avatar: userData.avatar,
      role: userData.role,
      isVerified: userData.isVerified,
    };
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);
    return null;
  }
};

// Convertir FirebaseUser a AuthUser
export const convertFirebaseUser = (
  firebaseUser: FirebaseUser,
  userData: User
): AuthUser => {
  return {
    id: firebaseUser.uid,
    email: userData.email,
    name: userData.name,
    avatar: userData.avatar,
    role: userData.role,
    isVerified: userData.isVerified,
  };
};
