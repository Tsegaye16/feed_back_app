declare module "*.jpg" {
  const value: string;
  export default value;
}
declare module "*.avif" {
  const content: string;
  export default content;
}

declare module "react-file-base64" {
  const FileBase: any;
  export default FileBase;
}
