export default function DownloadButton({ href, children }) {
  return (
    <a className="button-primary" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}
