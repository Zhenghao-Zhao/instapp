let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/Projects/nextjs/instapp
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +1 ~/Projects/nextjs/instapp
badd +26 backend/app/controllers/post_controller.go
badd +36 backend/db/sqlc/post.sql.go
badd +3 backend/db/sqlc/querier.go
badd +7 backend/db/sqlc/models.go
badd +17 backend/app/controllers/routes.go
badd +20 backend/app/controllers/utils.go
badd +25 backend/app/controllers/comment_controller.go
badd +25 backend/app/controllers/search_controller.go
badd +14 backend/app/controllers/user_controller.go
badd +45 backend/app/controllers/like_controller.go
badd +5 frontend/src/app/_libs/api/mutations/index.tsx
badd +90 frontend/src/app/_components/posts/components/Comments.tsx
badd +3 frontend/src/app/_libs/hooks/infiniteQueries/useFetchPosts.ts
badd +18 frontend/src/app/_libs/api/queries/index.ts
badd +151 backend/app/controllers/auth_controller.go
badd +22 frontend/src/app/(server)/api/posts/\[post_uid]/route.ts
badd +20 frontend/src/app/(server)/api/posts/\[post_uid]/comments/route.ts
badd +3 frontend/src/app/(server)/api/_utils/constants.ts
badd +30 backend/app/utils/auth/auth.go
badd +52 ~/Projects/open-source/realworld-gin-sqlc/main.go
badd +62 ~/Projects/open-source/realworld-gin-sqlc/db/sqlc/store.go
badd +23 frontend/src/app/(server)/api/_utils/queries.ts
badd +15 backend/.env
badd +44 backend/app/utils/api/responses.go
badd +54 backend/app/controllers/dtos.go
badd +6 frontend/src/app/(server)/api/posts/\[post_uid]/like/route.ts
badd +56 backend/app/controllers/follower_controller.go
badd +20 frontend/src/app/_libs/types/index.ts
badd +0 frontend/src/app/(server)/api/posts/\[post_uid]/comments/add/route.ts
badd +4 frontend/src/app/(server)/api/posts/route.ts
badd +0 frontend/src/app/(server)/_server/utils/mappings/index.ts
badd +0 frontend/src/app/(server)/api/\[uid]/profile/route.ts
badd +24 frontend/src/app/(pages)/\[username]/_components/FollowButton.tsx
badd +0 frontend/src/app/(pages)/\[username]/_content/header/index.tsx
badd +8 frontend/src/app/_components/posts/PostView.tsx
badd +0 frontend/src/app/(pages)/\[username]/_content/body/index.tsx
badd +4 frontend/src/app/(pages)/\[username]/_content/index.tsx
badd +56 frontend/src/app/(pages)/\[username]/_components/FriendsList.tsx
badd +24 frontend/src/app/(pages)/(home)/_components/FeedCard.tsx
badd +7 frontend/src/app/(pages)/p/\[post_uid]/_content/index.tsx
badd +0 frontend/src/app/_components/posts/utils/index.ts
badd +0 frontend/src/app/@modal/(.)p/\[post_uid]/page.tsx
badd +0 frontend/src/app/(pages)/explore/_content/index.tsx
badd +0 frontend/src/app/_components/posts/PostEntry.tsx
badd +3 frontend/src/app/_libs/hooks/infiniteQueries/useFetchExplorePosts.ts
badd +0 frontend/src/app/_libs/hooks/infiniteQueries/useFetchFeedPosts.ts
badd +3 frontend/src/app/_libs/hooks/infiniteQueries/useFetchComments.ts
badd +535 frontend/node_modules/@tanstack/query-core/build/modern/hydration-CTf4vERU.d.ts
badd +10 frontend/src/app/(pages)/\[username]/_components/ProfileImage.tsx
badd +23 frontend/src/app/(pages)/\[username]/_components/ProfileChanger.tsx
badd +172 frontend/src/app/_actions/index.ts
badd +23 frontend/src/app/(server)/api/_utils/index.ts
badd +58 /usr/local/go/src/net/http/client.go
badd +7 backend/app/controllers/service.go
badd +61 backend/app/controllers/server.go
badd +47 backend/config/config.go
badd +1 frontend/src/app/_libs/hooks/usePageOnLoad.ts
badd +4 frontend/src/app/_libs/hooks/useIsServer.ts
badd +3 frontend/src/app/_libs/hooks/infiniteQueries/useSearchPosts.ts
badd +7 frontend/src/app/(pages)/(home)/page.tsx
badd +199 frontend/src/app/(server)/_server/utils/queries/index.ts
badd +6 frontend/src/app/_components/auth/index.tsx
badd +42 frontend/src/app/_components/auth/forms/signUpForm/index.tsx
badd +20 frontend/src/app/(server)/_server/rsc/index.tsx
badd +6 frontend/src/app/_libs/contexts/providers/ServerContextProvider.tsx
badd +16 frontend/src/app/(pages)/\[username]/page.tsx
badd +3 term://~/Projects/nextjs/instapp/frontend//8643:/bin/zsh
badd +2 frontend/src/app/(templates)/internalError.tsx
badd +11 frontend/src/app/_api/axios.ts
badd +494 frontend/node_modules/axios/index.d.ts
badd +5 frontend/src/env.ts
badd +1 frontend/next-env.d.ts
badd +2 frontend/.env.local
badd +25 term://~/Projects/nextjs/instapp/frontend//14294:/bin/zsh
badd +10076 term://~/Projects/nextjs/instapp/frontend//14812:/bin/zsh
badd +26 backend/db/sqlc/db.go
badd +34 backend/db/sqlc/store.go
badd +11 backend/db/sqlc/user.sql.go
badd +61 frontend/src/app/_api/utils.ts
badd +5 frontend/environment.d.ts
badd +1 frontend/src/app/_components/auth/forms/signInForm/index.tsx
badd +22 ~/Projects/docker/todo-app/frontend/vite.config.ts
badd +3 docker-compose.yml
badd +4 frontend/next.config.js
badd +81 ~/go/pkg/mod/github.com/gorilla/sessions@v1.3.0/store.go
badd +4 ~/Projects/docker/todo-app/frontend/src/api/axios.ts
badd +39 frontend/src/app/_api/hooks/authentication.ts
badd +7 frontend/src/app/_api/endpoints.ts
badd +19 backend/app/controllers/errors.go
badd +2 ~/Projects/open-source/realworld-gin-sqlc/db/sqlc/db.go
badd +113 ~/Projects/open-source/realworld-gin-sqlc/api/server.go
badd +28 ~/Projects/open-source/realworld-gin-sqlc/db/sqlc/init.go
badd +31 ~/Projects/docker/todo-app/docker-compose.yml
badd +4 ~/Projects/docker/todo-app/.env
badd +5 .env
badd +578 ~/go/pkg/mod/github.com/spf13/viper@v1.19.0/viper.go
badd +116 ~/go/pkg/mod/github.com/spf13/viper@v1.19.0/util.go
badd +6 backend/Dockerfile
badd +18 backend/db/init.go
badd +24 frontend/src/app/_components/nav/navbar/components/ProfileMenu.tsx
badd +705 frontend/package-lock.json
badd +11 frontend/src/middleware.ts
badd +28 frontend/src/app/_libs/utils/supabase/middleware.ts
badd +3 frontend/src/app/_libs/hooks/infiniteQueries/useSearchUsers.ts
badd +3 frontend/src/app/_libs/hooks/infiniteQueries/useFetchFriends.ts
badd +3 frontend/src/app/_libs/hooks/infiniteQueries/useSearchFriends.ts
badd +95 ~/go/pkg/mod/github.com/jackc/pgx/v5@v5.7.2/tx.go
badd +457 ~/go/pkg/mod/github.com/jackc/pgx/v5@v5.7.2/conn.go
badd +12 frontend/src/app/_components/ui/buttons/submitButton/index.tsx
badd +22 frontend/node_modules/next/dist/client/router.d.ts
badd +80 ~/go/pkg/mod/github.com/gorilla/sessions@v1.3.0/sessions.go
badd +10 backend/go.mod
badd +56 backend/go.sum
badd +13 frontend/node_modules/next/dist/client/components/headers.d.ts
badd +29 frontend/src/app/layout.tsx
badd +49 frontend/src/app/(pages)/_layout/index.tsx
badd +137 frontend/src/app/_components/nav/guide/components/GuideBar.tsx
badd +13 frontend/src/app/_components/nav/guide/components/MiniGuide.tsx
badd +0 frontend/src/app/_components/nav/guide/components/GuideEntry.tsx
badd +24 frontend/src/app/_components/nav/guide/components/OverlayGuide.tsx
badd +2 frontend/src/app/_components/nav/guide/components/GuideSection.tsx
badd +1 frontend/src/app/_components/nav/guide/index.ts
badd +2 frontend/src/app/_components/nav/navbar/index.tsx
badd +2 frontend/src/app/_components/nav/navbar/components/index.tsx
badd +3 frontend/src/app/_components/nav/navbar/components/NavMenu.tsx
badd +1 frontend/src/app/_components/nav/navbar/components/Create.tsx
badd +33 frontend/src/app/_api/hooks/useUploadProfileImage.ts
badd +142 backend/app/controllers/account_controller.go
argglobal
%argdel
$argadd ~/Projects/nextjs/instapp
set stal=2
tabnew +setlocal\ bufhidden=wipe
tabrewind
edit frontend/src/app/_libs/api/mutations/index.tsx
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
wincmd _ | wincmd |
vsplit
2wincmd h
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd w
wincmd w
wincmd _ | wincmd |
split
1wincmd k
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe '1resize ' . ((&lines * 38 + 40) / 81)
exe 'vert 1resize ' . ((&columns * 93 + 140) / 281)
exe '2resize ' . ((&lines * 39 + 40) / 81)
exe 'vert 2resize ' . ((&columns * 93 + 140) / 281)
exe 'vert 3resize ' . ((&columns * 93 + 140) / 281)
exe '4resize ' . ((&lines * 39 + 40) / 81)
exe 'vert 4resize ' . ((&columns * 93 + 140) / 281)
exe '5resize ' . ((&lines * 38 + 40) / 81)
exe 'vert 5resize ' . ((&columns * 93 + 140) / 281)
argglobal
balt frontend/src/app/_api/hooks/useUploadProfileImage.ts
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 5 - ((4 * winheight(0) + 19) / 38)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 5
normal! 024|
lcd ~/Projects/nextjs/instapp/frontend
wincmd w
argglobal
if bufexists(fnamemodify("~/Projects/nextjs/instapp/frontend/src/app/(pages)/\[username]/page.tsx", ":p")) | buffer ~/Projects/nextjs/instapp/frontend/src/app/(pages)/\[username]/page.tsx | else | edit ~/Projects/nextjs/instapp/frontend/src/app/(pages)/\[username]/page.tsx | endif
if &buftype ==# 'terminal'
  silent file ~/Projects/nextjs/instapp/frontend/src/app/(pages)/\[username]/page.tsx
endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 16 - ((15 * winheight(0) + 19) / 39)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 16
normal! 034|
wincmd w
argglobal
if bufexists(fnamemodify("~/Projects/nextjs/instapp/frontend/src/app/_api/hooks/useUploadProfileImage.ts", ":p")) | buffer ~/Projects/nextjs/instapp/frontend/src/app/_api/hooks/useUploadProfileImage.ts | else | edit ~/Projects/nextjs/instapp/frontend/src/app/_api/hooks/useUploadProfileImage.ts | endif
if &buftype ==# 'terminal'
  silent file ~/Projects/nextjs/instapp/frontend/src/app/_api/hooks/useUploadProfileImage.ts
endif
balt ~/Projects/nextjs/instapp/frontend/src/app/_api/utils.ts
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 25 - ((24 * winheight(0) + 39) / 78)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 25
normal! 028|
lcd ~/Projects/nextjs/instapp/frontend
wincmd w
argglobal
if bufexists(fnamemodify("~/Projects/nextjs/instapp/backend/app/controllers/routes.go", ":p")) | buffer ~/Projects/nextjs/instapp/backend/app/controllers/routes.go | else | edit ~/Projects/nextjs/instapp/backend/app/controllers/routes.go | endif
if &buftype ==# 'terminal'
  silent file ~/Projects/nextjs/instapp/backend/app/controllers/routes.go
endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 12 - ((11 * winheight(0) + 19) / 39)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 12
normal! 029|
lcd ~/Projects/nextjs/instapp/backend
wincmd w
argglobal
if bufexists(fnamemodify("~/Projects/nextjs/instapp/backend/app/controllers/account_controller.go", ":p")) | buffer ~/Projects/nextjs/instapp/backend/app/controllers/account_controller.go | else | edit ~/Projects/nextjs/instapp/backend/app/controllers/account_controller.go | endif
if &buftype ==# 'terminal'
  silent file ~/Projects/nextjs/instapp/backend/app/controllers/account_controller.go
endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 253 - ((19 * winheight(0) + 19) / 38)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 253
normal! 037|
lcd ~/Projects/nextjs/instapp/backend
wincmd w
2wincmd w
exe '1resize ' . ((&lines * 38 + 40) / 81)
exe 'vert 1resize ' . ((&columns * 93 + 140) / 281)
exe '2resize ' . ((&lines * 39 + 40) / 81)
exe 'vert 2resize ' . ((&columns * 93 + 140) / 281)
exe 'vert 3resize ' . ((&columns * 93 + 140) / 281)
exe '4resize ' . ((&lines * 39 + 40) / 81)
exe 'vert 4resize ' . ((&columns * 93 + 140) / 281)
exe '5resize ' . ((&lines * 38 + 40) / 81)
exe 'vert 5resize ' . ((&columns * 93 + 140) / 281)
tabnext
argglobal
if bufexists(fnamemodify("term://~/Projects/nextjs/instapp/frontend//14812:/bin/zsh", ":p")) | buffer term://~/Projects/nextjs/instapp/frontend//14812:/bin/zsh | else | edit term://~/Projects/nextjs/instapp/frontend//14812:/bin/zsh | endif
if &buftype ==# 'terminal'
  silent file term://~/Projects/nextjs/instapp/frontend//14812:/bin/zsh
endif
balt term://~/Projects/nextjs/instapp/frontend//8643:/bin/zsh
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 9771 - ((67 * winheight(0) + 39) / 78)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 9771
normal! 049|
lcd ~/Projects/nextjs/instapp/frontend
tabnext 1
set stal=1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
