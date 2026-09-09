'use client';

export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="admin-loader"></span>
      <style jsx>{`
        .admin-loader {
          width: 44px;
          height: 44px;
          border: 4px dotted #3b82f6;
          border-radius: 50%;
          display: inline-block;
          animation: adminRotation 1.5s linear infinite;
        }
        @keyframes adminRotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
