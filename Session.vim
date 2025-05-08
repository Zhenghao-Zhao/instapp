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
badd +36 frontend/src/app/_components/post/PostComment.tsx
badd +4 frontend/src/app/_components/upload/AdjustableImage.tsx
badd +1 frontend/src/app/_components/upload/EditPalette.tsx
badd +1 frontend/src/app/_components/upload/Slider.tsx
badd +17 frontend/src/app/_components/post/EditPalette.tsx
badd +1 frontend/src/app/_components/post/Slider.tsx
badd +3 frontend/src/app/_components/post/AdjustableImage.tsx
badd +1 frontend/src/app/_components/post/CanvasImage.tsx
badd +1 frontend/src/app/_components/uploadSteps/Crop.tsx
badd +130 frontend/src/app/_components/uploadSteps/Drop.tsx
badd +1 frontend/src/app/_components/uploadSteps/Edit.tsx
badd +45 frontend/src/app/_libs/vars/constants.ts
badd +7 frontend/src/app/_components/uploadSteps/Finalize.tsx
badd +12 frontend/src/app/_components/common/IntersectObserver.tsx
badd +23 frontend/src/app/_components/common/InfiniteScrollLoader.tsx
badd +2 frontend/src/app/_components/common/ClickDetector.tsx
badd +21 frontend/src/app/_components/auth/AuthDataWrapper.tsx
badd +16 frontend/src/app/_components/auth/AuthPage.tsx
badd +6 frontend/src/app/_components/auth/SignInForm.tsx
badd +25 frontend/src/app/_components/ui/buttons/SubmitButton.tsx
badd +2 frontend/src/app/_components/auth/SignUpForm.tsx
badd +1 frontend/src/app/_components/auth/VerificationForm.tsx
badd +16 frontend/src/app/_libs/hooks/api/mutations/authentication.ts
badd +1 frontend/src/app/_libs/hocs/WithTooltip.tsx
badd +1 frontend/src/app/(templates)/internalError.tsx
badd +34 frontend/src/app/(pages)/_layout/index.tsx
badd +8 frontend/src/app/layout.tsx
badd +0 frontend/src/app/(pages)/_layout/ContentLayout.tsx
badd +34 frontend/src/app/ContentLayout.tsx
badd +17 frontend/src/app/(pages)/(home)/_content/Feed.tsx
badd +30 frontend/src/app/(pages)/\[username]/_components/FollowButton.tsx
badd +44 frontend/src/app/(pages)/\[username]/_components/FriendsList.tsx
badd +1 frontend/src/app/(pages)/\[username]/_components/Posts.tsx
badd +11 frontend/src/app/(pages)/\[username]/_components/Profile.tsx
badd +10 frontend/src/app/_components/ui/modal/ModalContent.tsx
badd +1 frontend/src/app/(pages)/\[username]/_components/ProfileChanger.tsx
badd +20 frontend/src/app/(pages)/\[username]/_components/ProfileImage.tsx
badd +3 frontend/src/app/(pages)/\[username]/page.tsx
badd +1 frontend/src/app/(pages)/explore/_content/index.tsx
badd +64 frontend/src/app/(pages)/p/\[postId]/_content/index.tsx
badd +37 frontend/src/app/(pages)/p/\[postId]/page.tsx
badd +5 frontend/src/app/_components/post/PostComments.tsx
badd +2 frontend/src/app/_components/post/CreatePost.tsx
badd +10 frontend/src/app/_components/post/CreatePostModal.tsx
badd +1 frontend/src/app/_components/post/DragBar.tsx
badd +1 frontend/src/app/_components/post/PostView.tsx
badd +3 frontend/src/app/_components/post/UploadHeader.tsx
badd +0 frontend/src/app/_components/guide/GuideSection.tsx
badd +47 frontend/src/app/_components/post/PostOptions.tsx
badd +2 frontend/src/app/_components/post/PostEntry.tsx
badd +1 frontend/src/app/_components/ui/alert/AlertContent.tsx
badd +0 frontend/src/app/_components/guide/OverlayGuide.tsx
badd +1 frontend/src/app/_components/ui/loaders/IconLoader.tsx
badd +1 frontend/src/app/_components/ui/loaders/ImageLoader.tsx
badd +15 frontend/src/app/_components/nav/NavMenu.tsx
badd +3 frontend/src/app/_components/nav/Navbar.tsx
badd +16 frontend/src/app/_components/nav/SearchBar.tsx
badd +1 frontend/src/app/_components/nav/ThemeChanger.tsx
badd +1 frontend/src/app/_components/ui/alert/AlertTrigger.tsx
badd +1 frontend/src/app/_components/ui/alert/DeleteAlert.tsx
badd +1 frontend/src/app/_components/ui/alert/DiscardAlert.tsx
badd +16 frontend/src/app/_components/ui/alert/alert.test.tsx
badd +8 frontend/src/app/_components/ui/buttons/IconButton.tsx
badd +18 frontend/src/app/_components/ui/buttons/IconLink.tsx
badd +16 frontend/src/app/_components/ui/carousel/CarouselArrow.tsx
badd +1 frontend/src/app/_components/ui/carousel/CarouselWrapper.tsx
badd +1 frontend/src/app/_components/ui/carousel/FloatCarousel.tsx
badd +1 frontend/src/app/_components/ui/carousel/SpaceCarousel.tsx
badd +1 frontend/src/app/_components/ui/divider/Divider.tsx
badd +1 frontend/src/app/_components/ui/divider/Separator.tsx
badd +1 frontend/src/app/_components/ui/dropdown/DropdownContent.tsx
badd +1 frontend/src/app/_components/ui/dropdown/DropdownTrigger.tsx
badd +16 frontend/src/app/_components/ui/dropdown/dropdown.test.tsx
badd +14 frontend/src/app/_components/ui/icon/Icon.tsx
badd +1 frontend/src/app/_components/ui/icon/Icons.tsx
badd +1 frontend/src/app/_components/ui/loaders/ListLoader.tsx
badd +1 frontend/src/app/_components/ui/loaders/Spinner.tsx
badd +1 frontend/src/app/_components/ui/loaders/Throbber.tsx
badd +1 frontend/src/app/_components/ui/modal/ModalBackdrop.tsx
badd +1 frontend/src/app/_components/ui/modal/ModalTrigger.tsx
badd +3 frontend/src/app/_components/ui/tooltip/TooltipWrapper.tsx
badd +1 frontend/src/app/_components/ui/tooltip/tooltip.test.tsx
badd +54 frontend/src/app/_components/ui/SearchBox.tsx
badd +17 frontend/src/app/_libs/contexts/Providers.tsx
badd +2 frontend/src/app/_libs/contexts/providers/AlertContextProvider.tsx
badd +40 frontend/src/app/_libs/contexts/providers/DropdownContextProvider.tsx
badd +8 frontend/src/app/_libs/contexts/providers/GuidebarContextProvider.tsx
badd +25 frontend/src/app/_components/guide/GuideBar.tsx
badd +1 frontend/src/app/_libs/contexts/providers/ModalContextProivder.tsx
badd +1 frontend/src/app/_libs/contexts/providers/ScrollContextProvider.tsx
badd +5 frontend/src/app/_libs/contexts/providers/ServerContextProvider.tsx
badd +1 frontend/src/app/_libs/hooks/useDebounce.ts
badd +1 frontend/src/app/_libs/hooks/useEndOfCarousel.ts
badd +1 frontend/src/app/_libs/hooks/api/utils.ts
badd +1 frontend/src/app/_libs/hooks/api/endpoints.ts
badd +2 frontend/src/app/_libs/hooks/api/axios.ts
badd +0 term://~/Projects/nextjs/instapp//49277:/bin/zsh
badd +6 frontend/src/app/_libs/utils/index.tsx
badd +124 frontend/src/app/_libs/vars/types.ts
badd +42 frontend/src/app/_components/nav/ProfileMenu.tsx
badd +7 frontend/src/app/_libs/hooks/worker/useWorker.ts
badd +21 frontend/src/app/(pages)/(home)/page.tsx
badd +29 frontend/src/app/(pages)/(home)/_components/FeedCard.tsx
badd +2 frontend/src/app/(pages)/(home)/_components/MiniPostOptions.tsx
badd +3 frontend/src/app/_components/guide/MiniGuide.tsx
badd +5 frontend/src/app/_components/guide/MiniGuideEntry.tsx
badd +2 frontend/src/app/_components/guide/GuideEntry.tsx
badd +1 frontend/src/app/_libs/hooks/useIsServer.ts
badd +27 frontend/src/app/_libs/hooks/api/queries/useGetPost.ts
badd +67 frontend/src/app/_libs/hooks/api/queries/useSearchFriends.ts
badd +44 frontend/src/app/_libs/hooks/api/queries/useSearchUsers.ts
badd +79 frontend/src/app/_libs/vars/schemas.ts
badd +8 frontend/src/app/_libs/hooks/api/queries/useFetchComments.ts
badd +4 frontend/src/app/_libs/hooks/api/queries/useFetchExplorePosts.ts
badd +20 frontend/src/app/_libs/hooks/api/queries/useFetchFeedPosts.ts
badd +1 frontend/src/app/_libs/hooks/api/queries/useFetchFriendships.ts
badd +35 frontend/src/app/_libs/hooks/api/queries/useFetchPosts.ts
badd +22 backend/app/controllers/routes.go
badd +42 backend/app/controllers/search_controller.go
badd +36 frontend/src/app/_libs/hooks/api/mutations/useCreateComment.ts
badd +17 frontend/src/app/_libs/hooks/api/mutations/useCreatePost.ts
badd +44 frontend/src/app/_libs/hooks/api/mutations/useDeletePost.ts
badd +31 frontend/src/app/_libs/hooks/api/mutations/useFetchProfile.ts
badd +28 frontend/src/app/_libs/hooks/api/mutations/useToggleCommentLike.ts
badd +22 frontend/src/app/_libs/hooks/api/mutations/useToggleFollow.ts
badd +21 frontend/src/app/_libs/hooks/api/mutations/useTogglePostLike.ts
badd +61 frontend/src/app/_libs/hooks/api/mutations/useUploadProfileImage.ts
badd +62 backend/db/queries/user.sql
badd +20 backend/db/queries/post.sql
badd +265 term://~/Projects/nextjs/instapp/backend//50479:/bin/zsh
badd +133 backend/app/controllers/post_controller.go
badd +108 backend/app/controllers/follower_controller.go
badd +37 backend/app/controllers/utils.go
badd +241 backend/app/controllers/account_controller.go
argglobal
%argdel
$argadd ./
set stal=2
tabnew +setlocal\ bufhidden=wipe
tabrewind
edit frontend/src/app/_libs/hooks/api/queries/useSearchFriends.ts
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd _ | wincmd |
split
1wincmd k
wincmd w
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
exe 'vert 1resize ' . ((&columns * 140 + 140) / 281)
exe '2resize ' . ((&lines * 39 + 40) / 81)
exe 'vert 2resize ' . ((&columns * 140 + 140) / 281)
exe 'vert 3resize ' . ((&columns * 140 + 140) / 281)
argglobal
balt frontend/src/app/_libs/hooks/api/queries/useSearchUsers.ts
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
let s:l = 67 - ((32 * winheight(0) + 19) / 38)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 67
normal! 048|
wincmd w
argglobal
if bufexists(fnamemodify("frontend/src/app/_libs/hooks/api/queries/useSearchUsers.ts", ":p")) | buffer frontend/src/app/_libs/hooks/api/queries/useSearchUsers.ts | else | edit frontend/src/app/_libs/hooks/api/queries/useSearchUsers.ts | endif
if &buftype ==# 'terminal'
  silent file frontend/src/app/_libs/hooks/api/queries/useSearchUsers.ts
endif
balt frontend/src/app/_libs/hooks/api/queries/useSearchFriends.ts
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
let s:l = 43 - ((34 * winheight(0) + 19) / 39)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 43
normal! 032|
lcd ~/Projects/nextjs/instapp/frontend
wincmd w
argglobal
if bufexists(fnamemodify("~/Projects/nextjs/instapp/backend/app/controllers/search_controller.go", ":p")) | buffer ~/Projects/nextjs/instapp/backend/app/controllers/search_controller.go | else | edit ~/Projects/nextjs/instapp/backend/app/controllers/search_controller.go | endif
if &buftype ==# 'terminal'
  silent file ~/Projects/nextjs/instapp/backend/app/controllers/search_controller.go
endif
balt ~/Projects/nextjs/instapp/backend/app/controllers/account_controller.go
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
let s:l = 43 - ((42 * winheight(0) + 39) / 78)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 43
normal! 09|
lcd ~/Projects/nextjs/instapp/backend
wincmd w
exe '1resize ' . ((&lines * 38 + 40) / 81)
exe 'vert 1resize ' . ((&columns * 140 + 140) / 281)
exe '2resize ' . ((&lines * 39 + 40) / 81)
exe 'vert 2resize ' . ((&columns * 140 + 140) / 281)
exe 'vert 3resize ' . ((&columns * 140 + 140) / 281)
tabnext
argglobal
if bufexists(fnamemodify("term://~/Projects/nextjs/instapp//49277:/bin/zsh", ":p")) | buffer term://~/Projects/nextjs/instapp//49277:/bin/zsh | else | edit term://~/Projects/nextjs/instapp//49277:/bin/zsh | endif
if &buftype ==# 'terminal'
  silent file term://~/Projects/nextjs/instapp//49277:/bin/zsh
endif
balt ~/Projects/nextjs/instapp/frontend/src/app/_libs/hooks/api/utils.ts
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 1820 - ((77 * winheight(0) + 39) / 78)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 1820
normal! 0
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
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
