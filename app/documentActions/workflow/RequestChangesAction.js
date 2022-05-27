import {EditIcon} from '@sanity/icons'
import {inferMetadataState, useWorkflowMetadata} from '../../lib/workflow'
import {useProjectUsers} from '../../lib/user'

export function RequestChangesAction(props) {
  const metadata = useWorkflowMetadata(props.id, inferMetadataState(props))
  const userList = useProjectUsers() || []
  const me = userList.find(u => u.isCurrentUser)

  if (metadata.data.state !== 'inReview') {
    return null
  }

  const onHandle = () => {
    metadata.setState('changesRequested')
    props.onComplete()
  }

  return {
    icon: EditIcon,
    disabled: !metadata.data.assignees.includes(me?.id),
    label: 'Request changes',
    onHandle
  }
}
