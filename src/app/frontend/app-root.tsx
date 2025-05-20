export const AppRoot = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[100dvh] w-screen items-center justify-center bg-black text-white">
      <div className="flex h-full max-h-[900px] w-full max-w-[600px] flex-col items-center justify-center rounded min-[600px]:border">
        {props.children}
      </div>
    </div>
  )
}
