export const SectionLayout = (props: { title: string; children: React.ReactNode }) => {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-4 pb-12">
      <p className="w-full px-6 text-left text-3xl font-bold">{props.title}</p>
      {props.children}
    </section>
  )
}
