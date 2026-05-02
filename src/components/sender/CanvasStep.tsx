import type { ContainerType, Widget } from '../../types/bouquet';
export default function CanvasStep({ onBack: _onBack, onFinish: _onFinish, saving }: {
  onBack: () => void;
  onFinish: (ct: ContainerType, w: Widget[], pu: string | null, pt: 'spotify' | 'youtube' | null) => void;
  saving: boolean;
}) {
  return <div>{saving ? 'saving' : 'canvas'}</div>;
}
