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
badd +2 ~/Projects/nextjs/instapp/frontend/src/app/_components/post/PostComment.tsx
badd +4 ~/Projects/nextjs/instapp/frontend/src/app/_components/upload/AdjustableImage.tsx
badd +0 ~/Projects/nextjs/instapp/frontend/src/app/_components/upload/EditPalette.tsx
badd +0 ~/Projects/nextjs/instapp/frontend/src/app/_components/upload/Slider.tsx
badd +0 ~/Projects/nextjs/instapp/frontend/src/app/_components/post/EditPalette.tsx
badd +0 ~/Projects/nextjs/instapp/frontend/src/app/_components/post/Slider.tsx
badd +0 ~/Projects/nextjs/instapp/frontend/src/app/_components/post/AdjustableImage.tsx
badd +0 ~/Projects/nextjs/instapp/frontend/src/app/_components/post/CanvasImage.tsx
badd +34 ~/Projects/nextjs/instapp/frontend/src/app/_components/uploadSteps/Crop.tsx
badd +37 ~/Projects/nextjs/instapp/frontend/src/app/_components/uploadSteps/Drop.tsx
badd +119 ~/Projects/nextjs/instapp/frontend/src/app/_components/uploadSteps/Edit.tsx
badd +18 ~/Projects/nextjs/instapp/frontend/src/app/_libs/vars/constants.ts
badd +7 ~/Projects/nextjs/instapp/frontend/src/app/_components/uploadSteps/Finalize.tsx
badd +12 ~/Projects/nextjs/instapp/frontend/src/app/_components/common/IntersectObserver.tsx
badd +23 ~/Projects/nextjs/instapp/frontend/src/app/_components/common/InfiniteScrollLoader.tsx
badd +2 ~/Projects/nextjs/instapp/frontend/src/app/_components/common/ClickDetector.tsx
badd +9 ~/Projects/nextjs/instapp/frontend/src/app/_components/auth/AuthDataWrapper.tsx
badd +16 ~/Projects/nextjs/instapp/frontend/src/app/_components/auth/AuthPage.tsx
badd +5 ~/Projects/nextjs/instapp/frontend/src/app/_components/auth/SignInForm.tsx
badd +29 ~/Projects/nextjs/instapp/frontend/src/app/_components/ui/buttons/SubmitButton.tsx
badd +2 ~/Projects/nextjs/instapp/frontend/src/app/_components/auth/SignUpForm.tsx
badd +1 ~/Projects/nextjs/instapp/frontend/src/app/_components/auth/VerificationForm.tsx
badd +30 ~/Projects/nextjs/instapp/frontend/src/app/_libs/hooks/api/mutations/authentication.ts
argglobal
%argdel
$argadd .
edit ~/Projects/nextjs/instapp/frontend/src/app/_components/auth/SignUpForm.tsx
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
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
exe 'vert 1resize ' . ((&columns * 140 + 140) / 281)
exe '2resize ' . ((&lines * 39 + 40) / 81)
exe 'vert 2resize ' . ((&columns * 140 + 140) / 281)
exe '3resize ' . ((&lines * 39 + 40) / 81)
exe 'vert 3resize ' . ((&columns * 140 + 140) / 281)
argglobal
enew
file oil:///Users/zhaozhenghao/Projects/nextjs/instapp/frontend/src/app/_components/
balt ~/Projects/nextjs/instapp/frontend/src/app/_components/ui/buttons/SubmitButton.tsx
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
wincmd w
argglobal
balt ~/Projects/nextjs/instapp/frontend/src/app/_components/auth/SignInForm.tsx
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
let s:l = 2 - ((1 * winheight(0) + 19) / 39)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 2
normal! 0
wincmd w
argglobal
if bufexists(fnamemodify("~/Projects/nextjs/instapp/frontend/src/app/_components/auth/SignInForm.tsx", ":p")) | buffer ~/Projects/nextjs/instapp/frontend/src/app/_components/auth/SignInForm.tsx | else | edit ~/Projects/nextjs/instapp/frontend/src/app/_components/auth/SignInForm.tsx | endif
if &buftype ==# 'terminal'
  silent file ~/Projects/nextjs/instapp/frontend/src/app/_components/auth/SignInForm.tsx
endif
balt ~/Projects/nextjs/instapp/frontend/src/app/_components/auth/SignUpForm.tsx
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
let s:l = 5 - ((4 * winheight(0) + 19) / 39)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 5
normal! 08|
wincmd w
3wincmd w
exe 'vert 1resize ' . ((&columns * 140 + 140) / 281)
exe '2resize ' . ((&lines * 39 + 40) / 81)
exe 'vert 2resize ' . ((&columns * 140 + 140) / 281)
exe '3resize ' . ((&lines * 39 + 40) / 81)
exe 'vert 3resize ' . ((&columns * 140 + 140) / 281)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
