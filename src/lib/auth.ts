import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
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

// Configurar el proveedor de Google
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

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



// Iniciar sesión con Google
export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Verificar si el usuario ya existe en Firestore
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

    if (!userDoc.exists()) {
      // Crear nuevo usuario en Firestore
      const newUserDoc: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || "",
        avatar: firebaseUser.photoURL || undefined,
        role: UserRole.USER, // Siempre USER por defecto
        isVerified: firebaseUser.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), newUserDoc);

      return {
        id: firebaseUser.uid,
        email: newUserDoc.email,
        name: newUserDoc.name,
        avatar: newUserDoc.avatar,
        role: newUserDoc.role,
        isVerified: newUserDoc.isVerified,
      };
    } else {
      // Usuario existente
      const userData = userDoc.data() as User;

      // Actualizar avatar si cambió
      if (firebaseUser.photoURL && firebaseUser.photoURL !== userData.avatar) {
        await setDoc(doc(db, "users", firebaseUser.uid), {
          ...userData,
          avatar: firebaseUser.photoURL,
          updatedAt: new Date(),
        });
      }

      return {
        id: firebaseUser.uid,
        email: userData.email,
        name: userData.name,
        avatar: firebaseUser.photoURL || userData.avatar,
        role: userData.role,
        isVerified: userData.isVerified,
      };
    }
  } catch (error: any) {
    throw new Error(error.message || "Error al iniciar sesión con Google");
  }
};
