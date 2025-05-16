export const JsonViewer = (props: { json: any }) => {
  return <pre className="font-mono text-xs">{JSON.stringify(props.json, null, 4)}</pre>
}
