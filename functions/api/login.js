export async function onRequestPost({request}){
  const {user,pwd}=await request.json();
  if(user=='admin'&&pwd=='123456'){
    return Response.json({ok:1,token:'ok'})
  }
  return Response.json({ok:0})
}
