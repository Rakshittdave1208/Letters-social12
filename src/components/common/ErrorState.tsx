type Props={
  message:string;

};

export default function ErrorState({message}:Props){
  return(
    <div className="text-center py-10 text-red-500">{message}</div>
  )
}