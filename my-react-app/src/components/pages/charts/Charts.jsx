import OrdersByCategoryBar from './OrdersByCategoryBar';
import ServiceCallsPie from './ServiceCallsPie';

export default function Charts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <OrdersByCategoryBar />
      <ServiceCallsPie />
    </div>
  );
}
