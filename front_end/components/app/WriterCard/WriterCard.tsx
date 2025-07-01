type WriterCardProps = {
  name: string
  bio: string
  image?: string | null
}

export default function WriterCard({ name, bio, image }: WriterCardProps) {
  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow p-6 h-full">
      {image ? (
        <img src={image} alt={name} className="w-20 h-20 rounded-full object-cover mb-4" />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-2xl font-bold text-gray-500">{name[0]}</div>
      )}
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground">{bio}</p>
    </div>
  )
}
