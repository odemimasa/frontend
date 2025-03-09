interface Window {
  handleAuth?: (response: { credential: string }) => void;
}
