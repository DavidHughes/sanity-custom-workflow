import {EditIcon} from '@sanity/icons'
import React from 'react'
import PropTypes from 'prop-types'
import {Flex, Box, Button, TextArea} from '@sanity/ui'
import {inferMetadataState, useWorkflowMetadata} from '../../lib/workflow'
import {useProjectUsers} from '../../lib/user'

export function RequestChangesAction(props) {
  const [showWizardDialog, setShowWizardDialog] = React.useState(false)
  const [feedback, setFeedback] = React.useState('')
  const metadata = useWorkflowMetadata(props.id, inferMetadataState(props))
  const userList = useProjectUsers() || []
  const me = userList.find(u => u.isCurrentUser)

  if (metadata.data.state !== 'inReview') {
    return null
  }

  const onSend = () => {
    metadata.setFeedback(feedback)
    metadata.setState('changesRequested')
    metadata.setReviewerId(me.id)
    props.onComplete()
  }

  const onHandle = () => {
    if (!showWizardDialog) {
      setShowWizardDialog(true)
    }
  }

  return {
    dialog: showWizardDialog && {
      type: 'popover',
      content: (
        <Flex direction="column" align="center" justify="space-around" padding={2} width={1}>
          <Box flex={1}>
            <TextArea
              onChange={e => setFeedback(e.currentTarget.value)}
              placeholder="Feedback for this document's changes"
              value={feedback}
            />
          </Box>
          <Box flex={1} paddingTop="30">
            <Button onClick={onSend} text="Request changes" tone="primary" />
          </Box>
        </Flex>
      ),
      onClose: props.onComplete
    },
    icon: EditIcon,
    disabled: !metadata.data.assignees.includes(me?.id) && showWizardDialog,
    label: 'Request changes',
    onHandle
  }
}

RequestChangesAction.propTypes = {
  id: PropTypes.string,
  onComplete: PropTypes.func
}
