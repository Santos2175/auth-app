import FloatingShape from '../ui/FloatingShape';

type AppLayoutProps = {
  children: React.ReactNode;
  showFloatingShape?: boolean;
};

const AppLayout = ({ showFloatingShape = true, children }: AppLayoutProps) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 flex items-center justify-center relative overflow-hidden'>
      {showFloatingShape && (
        <>
          <FloatingShape
            color='bg-blue-500'
            size='h-64 w-64'
            top='-5%'
            left='0%'
            delay={0}
          />
          <FloatingShape
            color='bg-cyan-500'
            size='h-48 w-48'
            top='70%'
            left='80%'
            delay={5}
          />
          <FloatingShape
            color='bg-sky-500'
            size='h-32 w-32'
            top='40%'
            left='10%'
            delay={2}
          />
        </>
      )}

      <main className='relative z-20 w-full max-w-md mx-auto p-4'>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
