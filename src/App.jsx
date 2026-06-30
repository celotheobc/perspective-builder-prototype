import { useMemo, useState } from 'react';
import PrototypeCover from './pages/cover/PrototypeCover';
import PerspectiveBuilderV1 from './pages/v1/PerspectiveBuilderV1';
import PerspectiveBuilderV2 from './pages/v2/PerspectiveBuilderV2';
import PerspectiveBuilderV3 from './pages/v3/PerspectiveBuilderV3';
import PerspectiveBuilderV4 from './pages/v4/PerspectiveBuilderV4';
import PerspectiveBuilderV1_5 from './pages/v1_5/PerspectiveBuilderV1_5';

function resolveVersion(saved) {
  if (saved === 'cover' || saved === 'home') return 'cover';
  if (saved === 'v1') return 'v1';
  if (saved === 'v2') return 'v2';
  if (saved === 'v3') return 'v3';
  if (saved === 'v4') return 'v4';
  if (saved === 'v1.5' || saved === 'v1_5') return 'v1.5';
  return 'cover';
}

export default function App() {
  const [version, setVersion] = useState(() => {
    const saved = sessionStorage.getItem('pb-prototype-version');
    return resolveVersion(saved);
  });

  const handleVersionChange = (next) => {
    setVersion(next);
    sessionStorage.setItem('pb-prototype-version', next);
  };

  const page = useMemo(() => {
    if (version === 'cover') {
      return <PrototypeCover onSelectVersion={handleVersionChange} />;
    }
    if (version === 'v1') {
      return <PerspectiveBuilderV1 onVersionChange={handleVersionChange} />;
    }
    if (version === 'v2') {
      return <PerspectiveBuilderV2 onVersionChange={handleVersionChange} />;
    }
    if (version === 'v1.5') {
      return <PerspectiveBuilderV1_5 onVersionChange={handleVersionChange} />;
    }
    if (version === 'v4') {
      return <PerspectiveBuilderV4 onVersionChange={handleVersionChange} />;
    }
    return <PerspectiveBuilderV3 onVersionChange={handleVersionChange} />;
  }, [version]);

  return page;
}
