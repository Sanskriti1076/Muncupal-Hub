// // /**
// //  * WARNING: This file connects this app to Create's internal auth system. Do
// //  * not attempt to edit it. Do not import @auth/create or @auth/create
// //  * anywhere else or it may break. This is an internal package.
// //  */
// // import CreateAuth from '@auth/create';
// // import Credentials from '@auth/core/providers/credentials';

// // const result = CreateAuth({
// // 	providers: [
// // 		Credentials({
// // 			credentials: {
// // 				email: {
// // 					label: 'Email',
// // 					type: 'email',
// // 				},
// // 				password: {
// // 					label: 'Password',
// // 					type: 'password',
// // 				},
// // 			},
// // 		}),
// // 	],
// // 	pages: {
// // 		signIn: '/account/signin',
// // 		signOut: '/account/logout',
// // 	},
// // });
// // export const { auth } = result;
// // Check if user has municipal access
// export function isMunicipalUser() {
//   if (typeof window === 'undefined') return false;
  
//   // Check for municipal-specific session data
//   const userRole = localStorage.getItem('user_role');
//   const userDepartment = localStorage.getItem('user_department');
  
//   // Municipal users should have specific role/department
//   return userRole === 'municipal' || userDepartment?.includes('Municipal');
// }

// // Redirect if not municipal user
// export function requireMunicipalAccess() {
//   if (typeof window === 'undefined') return false;
  
//   if (!isMunicipalUser()) {
//     window.location.href = '/municipal/login';
//     return false;
//   }
//   return true;
// }

// // Get municipal user info
// export function getMunicipalUser() {
//   if (typeof window === 'undefined') return null;
  
//   try {
//     const userStr = localStorage.getItem('user_data');
//     if (!userStr) return null;
    
//     const user = JSON.parse(userStr);
    
//     // Check if user has municipal access
//     if (user.role === 'municipal' || user.department?.includes('Municipal')) {
//       return user;
//     }
    
//     return null;
//   } catch {
//     return null;
//   }
// }
import CreateAuth from "@auth/create"
import Credentials from "@auth/core/providers/credentials"

export const { auth } = CreateAuth({
  providers: [Credentials({
    credentials: {
      email: {
        label: 'Email',
        type: 'email',
      },
      password: {
        label: 'Password',
        type: 'password',
      },
    },
  })],
  pages: {
    signIn: '/account/signin',
    signOut: '/account/logout',
  },
})

