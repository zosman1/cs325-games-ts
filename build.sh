for d in */
   do
     ( cd "$d" && npm i && npm run build )
   done
