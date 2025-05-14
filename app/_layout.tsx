import { Tabs } from "expo-router";

export default function Layout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#05AF31' }}>
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="cadastro-moto" options={{ title: "Cadastro de Moto" }} />
            <Tabs.Screen name="devs" options={{ title: "Developers" }} />
        </Tabs>
    );
}

// EXEMPLO DE USO DAS 3 NAVEGAÇÕES

// import { Drawer } from 'expo-router/drawer';
// import { Stack } from 'expo-router/stack';
// import { Tabs } from 'expo-router/tabs';

// export default function Layout() {
//   return (
//     <Drawer>
//       {/* Tela inicial com Drawer */}
//       <Drawer.Screen name="home" options={{ title: "Home" }} />
      
//       {/* Tela de Profile com Stack aninhado */}
//       <Drawer.Screen name="profile" options={{ title: "Profile" }}>
//         <Stack>
//           <Stack.Screen name="profileDetails" options={{ title: "Profile Details" }} />
//           <Stack.Screen name="profileSettings" options={{ title: "Profile Settings" }} />
          
//           {/* Tabs dentro de Profile */}
//           <Tabs>
//             <Tabs.Screen name="overview" options={{ title: "Overview" }} />
//             <Tabs.Screen name="settings" options={{ title: "Settings" }} />
//           </Tabs>
//         </Stack>
//       </Drawer.Screen>
//     </Drawer>
//   );
// }
