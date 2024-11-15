// import { useState } from "react";
// import Button from "../../ui/Button";
import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";

import Button from "../../ui/Button";

export default function AddCabin() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="cabin-form">
          <Button>Add New</Button>
        </Modal.Open>
        <Modal.Window name="cabin-form">
          <CreateCabinForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

// export default function AddCabin() {
//   const [showForm, setShowForm] = useState(false);
//   return (
//     <div>
//       <Button onClick={() => setShowForm((show) => !show)}>
//         Add New Cabin
//       </Button>
//       {showForm && (
//         <Modal onClose={() => setShowForm(false)}>
//           <CreateCabinForm onClose={() => setShowForm(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }
