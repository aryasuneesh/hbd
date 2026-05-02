import { useState } from 'react';
import CreatePage from './components/sender/CreatePage';
import SharePage from './components/sender/SharePage';
import BouquetPage from './components/receiver/BouquetPage';

type Route =
  | { name: 'create' }
  | { name: 'share'; bouquetId: string }
  | { name: 'bouquet'; bouquetId: string };

function getInitialRoute(): Route {
  const path = window.location.pathname;
  const match = path.match(/^\/b\/([^/]+)/);
  if (match) return { name: 'bouquet', bouquetId: match[1] };
  return { name: 'create' };
}

export default function App() {
  const [route, setRoute] = useState<Route>(getInitialRoute);

  if (route.name === 'bouquet') {
    return <BouquetPage bouquetId={route.bouquetId} />;
  }
  if (route.name === 'share') {
    return <SharePage bouquetId={route.bouquetId} onCreateAnother={() => setRoute({ name: 'create' })} />;
  }
  return (
    <CreatePage
      onComplete={(id) => {
        window.history.pushState({}, '', `/b/${id}`);
        setRoute({ name: 'share', bouquetId: id });
      }}
    />
  );
}
