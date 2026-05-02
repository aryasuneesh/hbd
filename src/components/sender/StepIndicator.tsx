export default function StepIndicator({ current, total }: { current: number; total: number }) {
  return <div data-current={current} data-total={total} />;
}
