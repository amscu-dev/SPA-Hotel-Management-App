import { useState } from "react";
import { useUser } from "../../features/authentication/useUser";
import { useUpdateUser } from "../../features/authentication/useUpdateUser";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

function UpdateUserDataForm() {
  // La acest moment ['user'] este deja prezent in cache, nu avem nevoie de isLoading state
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName },
    },
  } = useUser();
  const { updateUser, isUpdating } = useUpdateUser();
  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);

  // LOGIC
  function handleCancel() {
    // Nu avem nevoie de preventDefault pentru că acest buton este gândit să reseteze formularul(HTML attribute 'reset')
    setFullName(currentFullName);
    setAvatar(null);
  }
  // Funcția care va fi apelată la submit
  function handleSubmit(e) {
    e.preventDefault(); // Prevenim comportamentul implicit al formularului
    if (!fullName) return; // Nu trimitem formularul dacă numele complet nu este completat
    updateUser(
      { fullName, avatar }, // Trimitem datele actualizate
      {
        onSucces: () => {
          setAvatar(null); // Resetăm avatarul după succes
          e.target.reset(); // Resetăm formularul
        },
      }
    );
  }
  // UI
  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          disabled={isUpdating}
          onChange={(e) => setAvatar(e.target.files[0])}
        />
      </FormRow>
      <FormRow>
        <Button
          onClick={handleCancel}
          type="reset"
          variation="secondary"
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
