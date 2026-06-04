export async function onRequestPost({request}){
  const {user,pwd}=await request.json();
  if(user=='admin'&&pwd=='123456') return Response.json({ok:1});
  return Response.json({ok:0});
}
