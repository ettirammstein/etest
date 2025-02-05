import GalaxyScene from '@/components/GalaxyScene';

const Index = () => {
  return (
    <div className="relative w-full h-screen">
      <GalaxyScene />
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-2xl font-space z-10">
        Galactic Words
      </div>
    </div>
  );
};

export default Index;