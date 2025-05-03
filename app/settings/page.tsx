import { signOut } from "@/auth";
import { Button, Heading } from "@chakra-ui/react";

export default function Settings() {
  return (
    <>
      <Heading mb="5" size="lg">
        Innstillinger
      </Heading>
      {/* <AddNickName nickname={data.existingNickName} /> */}
      <Button onClick={() => signOut()}>Logg ut</Button>;
    </>
  );
}
