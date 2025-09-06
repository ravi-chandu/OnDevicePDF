export default function InstallBanner({ event, onClose }){
  if (!event) return null
  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center z-50">
      <div className="max-w-xl w-[92%] bg-white border rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
        <div className="text-sm"><strong>Install OnDevicePDF</strong><div className="text-slate-600">Quick access. Works offline.</div></div>
        <div className="ml-auto flex gap-2">
          <button className="px-3 py-1.5 text-sm rounded-lg border" onClick={onClose}>Not now</button>
          <button className="px-3 py-1.5 text-sm rounded-lg bg-black text-white" onClick={async()=>{event.prompt();await event.userChoice;onClose();}}>Install</button>
        </div>
      </div>
    </div>
  )
}
