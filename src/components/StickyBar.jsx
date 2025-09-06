export default function StickyBar({ children }){
  return <div className="sticky-bar md:static md:p-0 md:bg-transparent md:border-0"><div className="container flex gap-2 justify-end">{children}</div></div>
}
