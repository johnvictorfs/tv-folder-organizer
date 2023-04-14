import { useState } from "react"
import { api } from "~/utils/api"

export const NewDirectory: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [currentDirectory, setCurrentDirectory] = useState<string>()

  const { data: directoryTree } = api.directory.getDirectoryStructure.useQuery(
    { currentPath: currentDirectory }
  );

  return (
    <>
      {/* <Button onClick={() => setModalOpen(true)}>
        Add Directory
      </Button>

      <Modal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Modal.Header>
          Adding new Directory to be tracked
        </Modal.Header>

        <Modal.Body>
          {directoryTree?.currentLocation}
        </Modal.Body>
      </Modal> */}
    </>
  )
}
