import { TagForm } from "./components/tag-Form"
const TagPage = async () => {
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <TagForm  />
        </div>
    </div>
  )
}

export default TagPage