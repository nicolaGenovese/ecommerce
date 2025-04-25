import { Container } from "@/components/ui/container";

export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <Container>
        <div className="mx-auto py-10">
          <p className="text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Store, Inc. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};