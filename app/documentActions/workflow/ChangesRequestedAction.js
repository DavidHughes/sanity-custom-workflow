import React from 'react'
import PropTypes from 'prop-types'
import {inferMetadataState, useWorkflowMetadata} from '../../lib/workflow'
import {useProjectUsers} from '../../lib/user'

export function ChangesRequestedAction(props) {
  const [showFeedback, setShowFeedback] = React.useState(false)
  const metadata = useWorkflowMetadata(props.id, inferMetadataState(props))
  const {state, feedback, reviewerId} = metadata.data

  const userList = useProjectUsers() || []
  const reviewer = reviewerId ? userList.find(u => u.id === reviewerId) : {name: 'Not set'}

  if (state !== 'changesRequested') {
    return null
  }

  return {
    label: 'View requested changes',
    onHandle: () => {
      setShowFeedback(true)
    },
    dialog: showFeedback && {
      type: 'modal',
      onClose: props.onComplete,
      header: 'Feedback to action',
      content: (
        <div>
          <p>{feedback}</p>
          <p>
            Reviewed by: <a href={`mailto:${reviewer.email}`}>{reviewer.displayName}</a>
          </p>
        </div>
      )
    }
  }
}

ChangesRequestedAction.propTypes = {
  id: PropTypes.string,
  onComplete: PropTypes.func
}
