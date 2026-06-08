import React from 'react';
import { useUIStore } from './store/useUIStore';
import { MainMenu } from './components/MainMenu/MainMenu';
import { PortMap } from './components/PortMap/PortMap';
import { FleetManagement } from './components/Fleet/FleetManagement';
import { OrderHall } from './components/Orders/OrderHall';
import { WarehouseManagement } from './components/Warehouse/WarehouseManagement';
import { SettlementAchievements } from './components/Achievements/SettlementAchievements';

const App: React.FC = () => {
  const { currentPage } = useUIStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'main-menu':
        return <MainMenu />;
      case 'port':
        return <PortMap />;
      case 'fleet':
        return <FleetManagement />;
      case 'orders':
        return <OrderHall />;
      case 'warehouse':
        return <WarehouseManagement />;
      case 'achievements':
        return <SettlementAchievements />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="min-h-screen bg-game-dark">
      {renderPage()}
    </div>
  );
};

export default App;
