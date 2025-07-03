import Dashboard from './pages/Dashboard';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}

export default App;

// import Dashboard from './pages/Dashboard';
// import AppLayout from './components/layout/AppLayout';

// function App() {
//   try {
//     return (
//       <AppLayout>
//         <Dashboard />
//       </AppLayout>
//     );
//   } catch (error) {
//     return (
//       <div style={{ padding: '20px', color: 'red' }}>
//         <h1>Error in App</h1>
//         <pre>{error.toString()}</pre>
//       </div>
//     );
//   }
// }

// export default App;