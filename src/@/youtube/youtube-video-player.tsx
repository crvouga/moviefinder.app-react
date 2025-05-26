export const YoutubeVideoPlayer = (props: { youtubeVideoKey: string; className?: string }) => {
  const embedUrl = `https://www.youtube.com/embed/${props.youtubeVideoKey}?autoplay=1`

  return (
    <div className={`aspect-video w-full ${props.className ?? ''}`}>
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="border-0"
      ></iframe>
    </div>
  )
}
