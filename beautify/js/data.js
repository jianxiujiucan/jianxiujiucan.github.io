const navList = [
  "最新影片",
  "经典影片",
  "国内电影",
  "欧美电影",
  "其它电影",
  "华语电视",
  "欧美电视",
  "最新综艺",
  "旧版综艺",
  "动漫资源",
  "旧版游戏",
  "游戏下载",
  "高分经典"
]
const linkList = [
  {
    title: "IMDB评分8分左右影片500余部",
    link: "https://www.dydytt.net/html/gndy/jddy/20160320/50523.html",
  },
  {
    title: "2023年动作《西行纪之暗影魔",
    link: "https://www.dydytt.net/html/gndy/jddy/20230307/63487.html",
  },
  {
    title: "2023年恐怖《小鬼入侵》BD中",
    link: "https://www.dydytt.net/html/gndy/jddy/20230307/63486.html",
  },
  {
    title: "2022年恐怖《寻找身体》BD日",
    link: "https://www.dydytt.net/html/gndy/jddy/20230305/63485.html",
  },
  {
    title: "2022年剧情爱情《可不可以不",
    link: "https://www.dydytt.net/html/gndy/jddy/20230305/63484.html",
  },
  {
    title: "2022年剧情《巴黎夜旅人》BD",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230304/63476.html",
  },
  {
    title: "2023年喜剧爱情《熟悉的陌生",
    link: "https://www.dydytt.net/html/gndy/jddy/20230303/63475.html",
  },
  {
    title: "2022年剧情《正义回廊》BD国",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230302/63474.html",
  },
  {
    title: "2022年喜剧科幻《这里是亚美",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230302/63473.html",
  },
  {
    title: "2023年剧情喜剧《魔力麦克3：",
    link: "https://www.dydytt.net/html/gndy/jddy/20230302/63472.html",
  },
  {
    title: "2022年剧情《鲸/我的鲸鱼老爸",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230301/63471.html",
  },
  {
    title: "2022年剧情喜剧《生无可恋的",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230301/63470.html",
  },
  {
    title: "2023年悬疑恐怖《寻龙·镇魂",
    link: "https://www.dydytt.net/html/gndy/jddy/20230228/63469.html",
  },
  {
    title: "2022年剧情《鱼之子》BD日语",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230228/63468.html",
  },
  {
    title: "2023年剧情《千寻小姐》BD日",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230227/63467.html",
  },
  {
    title: "2023年悬疑恐怖喜剧《我们有",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230227/63466.html",
  },
  {
    title: "2022年剧情《女人们的谈话》B",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230226/63462.html",
  },
  {
    title: "2022年剧情爱情《光之帝国》B",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230226/63461.html",
  },
  {
    title: "2022年惊悚动作《盗贼/天劫高",
    link: "https://www.dydytt.net/html/gndy/jddy/20230225/63460.html",
  },
  {
    title: "2023年动作喜剧《终极哈特》B",
    link: "https://www.dydytt.net/html/gndy/jddy/20230225/63459.html",
  }
];

const linkList2023 = [
  {
    title: "推荐下载本站app",
    link: "/app.html",
    date: "2023-02-21",
  },
  {
    title: "2022年剧情《巴黎夜旅人》BD法语中字2022年剧情《巴黎夜旅人》BD法语中字",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230304/63476.html",
    date: "2023-02-21",
  },
  {
    title: "2022年剧情《正义回廊》BD国粤双语中字",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230302/63474.html",
    date: "2023-02-21",
  },
  {
    title: "2022年喜剧科幻《这里是亚美子》BD日语中字",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230302/63473.html",
    date: "2023-02-21",
  },
  {
    title: "2022年剧情《鲸/我的鲸鱼老爸》BD中英双字",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230301/63471.html",
    date: "2023-02-21",
  },
  {
    title: "2022年剧情喜剧《生无可恋的奥托》BD英语中字",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230301/63470.html",
    date: "2023-02-21",
  },
  {
    title: "《鱼之子》BD日语中字",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230228/63468.html",
    date: "2023-02-21",
  },
  {
    title: "2023年剧情《千寻小姐》BD日语中字BD日语中字BD日语中字",
    link: "https://www.dydytt.net/html/gndy/dyzz/20230227/63467.html",
    date: "2023-02-21",
  }
];

const imageList = [
  {
    title: "《非常警事》",
    link: "https://www.xl720.com/thunder/49414.html",
    src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/ef705bda8c88295d38ee836eb3718ff1f.jpg",
  },
  {
    title: "2023年国产大陆电视剧《谜寻》连载至12 迅雷下载",
    link: "https://www.xl720.com/thunder/49427.html",
    src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/8a9bd59c4b5d4a20e3750687ca4e5c2e.jpg",
  },
  {
    title: "2023年国产大陆电视剧《下一站你的世界》全24集 迅雷下载",
    link: "https://www.xl720.com/thunder/49331.html",
    src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/52d3da741e1e582440969a3c5eeff355.jpg",
  },
  {
    title: "《许你万家灯火》",
    link: "https://www.xl720.com/thunder/49433.html",
    src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/1c81791f15e4c5c6486a8b65c548698f.jpg",
  },
  {
    title: "《风雨送春归》",
    link: "https://www.xl720.com/thunder/49302.html",
    src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/e5f21abd2169a05ae52423e7b537be43.jpg",
  },
  {
    title: "《九霄寒夜暖》",
    link: "https://www.xl720.com/thunder/49404.html",
    src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/f4c23c5cab2ccf9465498d4cc8038df1.jpg",
  },
  // {
  //   title: "2023年韩国电视剧《模范出租车2》连载至05 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49360.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/94d0eaabcfb419d04f4822f0894c2227.jpg",
  // },
  // {
  //   title: "2023年日本电视剧《重启人生》连载至09 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49053.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/2f3336edffbc1ecbfe298229b3a3ca7b.jpg",
  // },
  // {
  //   title: "2022年韩国电视剧《三姐妹要勇敢》连载至47 迅雷下载",
  //   link: "https://www.xl720.com/thunder/48323.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/a567582942aba9ddc1c6d9bfe6a718e7.jpg",
  // },
  // {
  //   title: "2023年日本电视剧《Get Ready!》连载至09 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49078.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/a0360df17f58495c4ecc5bfabdecf954.jpg",
  // },
  // {
  //   title: "2023年中国香港电视剧《隐形战队》连载至01 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49449.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/1f40c1d4a81e047715c6e235326416e9.jpg",
  // },
  // {
  //   title: "2023年国产大陆电视剧《那年时光安好》连载至10 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49417.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/edea96fda9f4160e297668b8b5994ca7.jpg",
  // },
  // {
  //   title: "2023年国产大陆电视剧《曾少年之小时候》连载至14 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49416.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/2ff0ac044ec5f0cb34282f228e1ce5fb.jpg",
  // },
  // {
  //   title: "2023年国产大陆电视剧《重紫》连载至30 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49324.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/b47667bd23f60673793922bc8505ca62.jpg",
  // },
  // {
  //   title: "2023年国产大陆电视剧《绝配酥心唐》全16集 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49431.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/63d6c99aaa75fff50db843e7500a9a03.jpg",
  // },
  // {
  //   title: "2023年国产大陆电视剧《情满九道弯》连载至38 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49343.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/726b103a4829836b3c0b881bc19f1e7a.jpg",
  // },
  // {
  //   title: "2023年国产大陆电视剧《星落凝成糖》连载至32 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49335.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/362c84f2f7648f49336fc9714e088bbc.jpg",
  // },
  // {
  //   title: "2023年美国电视剧《最后生还者》连载至08 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49137.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/56177f2c5df4531fd89689cd81f030e6.jpg",
  // },
  // {
  //   title: "2023年美国电视剧《金斯敦市长 第二季》连载至08 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49138.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/b31e65da8b99847b67ba562784e12db3.jpg",
  // },
  // {
  //   title: "2023年韩国电视剧《离婚律师申晟瀚》连载至02 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49441.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/84edca9d369cb837ae546f1654fab1f9.jpg",
  // },
  // {
  //   title: "2023年日本电视剧《怎么办家康》连载至09 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49067.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/a5ef80681d250bcd3e5384029def7a02.jpg",
  // },
  // {
  //   title: "2023年韩国电视剧《浪漫速成班》全16集 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49133.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/57912573ad2a6fe3da6d395391d9196a.jpg",
  // },
  // {
  //   title: "2023年国产大陆电视剧《今日宜加油》连载至32 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49374.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/7e1bd8c55307690bdab4c768e9688b55.jpg",
  // },
  // {
  //   title: "2023年国产大陆电视剧《嘘！看手机》连载至04 迅雷下载",
  //   link: "https://www.xl720.com/thunder/49448.html",
  //   src: "https://xl720.dnscf.xyz/cdn-cgi/image/w=180,h=260,fit=cover/uploads/2023/03/530297f1ed4a0735044d85a6acb6ea57.jpg",
  // },
];



const listContent = [
  {
    title: "oumeitvoumeitvoumeitvoumeitvoumeitvoumeitvoumeitvoumeitvoumeitv",
    link: "/html/tv/oumeitv/20230123/63363.html",
    date: "日期：2023-02-28 20:16:45",
    content:
      "◎译 名 最后生还者 / 美国末日 / 末日余生 ◎片 名 The Last of Us ◎年 代 2023 ◎产 地 美国 / 加拿大 ◎类 别 剧情 / 动作 / 科幻 / 惊悚 / 恐怖 / 冒险 ◎语 言 英语 ◎字 幕 中英双字 ◎上映日期 2023-01-15(美国) ◎IMDb评分 9.4/10 from 66067 users ◎豆瓣评",
  },
  {
    title: "2022年奇幻《指环王：力量之戒 第一季》更新第08集[中英双字]",
    link: "/html/tv/oumeitv/20220904/62948.html",
    date: "日期：2022-10-07 23:10:28",
    content:
      "◎译 名 指环王：力量之戒 第一季/指环王：权能之戒/指环王剧版/魔戒/魔戒:統御魔戒 ◎片 名 The Lord of the Rings: The Rings of Power Season 1/The Lord of the Rings ◎年 代 2022 ◎产 地 美国 ◎类 别 奇幻 / 冒险 ◎语 言 英语 ◎上映日期 2022-09-02(美国) ◎",
  },
  {
    title: "2022年科幻动作《龙之家族 第一季》更新第10集[中英双字]本季终",
    link: "/html/tv/oumeitv/20220823/62911.html",
    date: "日期：2022-10-25 23:47:59",
    content:
      "◎译 名 龙之家族/坦格利安/权力的游戏：龙之堡/权力的游戏前传：龙族/权力的游戏衍生剧：龙族/龙族/龙王家族 ◎片 名 House of the Dragon/Fire Blood ◎年 代 2022 ◎产 地 美国 ◎类 别 剧情/动作/爱情/奇幻/冒险 ◎语 言 英语 ◎字 幕 中英双字 ◎上映日期 2022-08",
  },
  {
    title: "2022年科幻悬疑《西部世界 第四季》更新第01-08集[中英双字]",
    link: "/html/tv/oumeitv/20220723/62819.html",
    date: "日期：2022-08-16 23:59:07",
    content:
      "◎译 名 西部世界 第四季 / 西方极乐园(台) ◎片 名 Westworld Season 4 ◎年 代 2022 ◎产 地 美国 ◎类 别 剧情/科幻/悬疑 ◎语 言 英语 ◎字 幕 中英双字 ◎上映日期 2022-06-26(美国) ◎IMDb评分 7.4/10 from 3258 users ◎豆瓣评分 8.4/10 from 5152 users ◎集",
  },
  {
    title: "2022年冒险动作《月光骑士 第一季》更新第06集[中英双字]",
    link: "/html/tv/oumeitv/20220401/62466.html",
    date: "日期：2022-05-05 18:13:13",
    content:
      "◎译 名 月光骑士 ◎片 名 Moon Knight ◎年 代 2022 ◎产 地 美国 ◎类 别 剧情/动作/科幻/恐怖/奇幻/冒险 ◎语 言 英语 ◎字 幕 中英双字 ◎上映日期 2022-03-30(美国) ◎IMDb评分 7.4/10 from 15324 users ◎豆瓣评分 8.9/10 from 7823 users ◎集 数 6 ◎片 长 50",
  },
  {
    title: "2022年科幻动作《光环 第一季》更新第06集[中英双字]",
    link: "/html/tv/oumeitv/20220328/62458.html",
    date: "日期：2022-05-01 20:06:16",
    content:
      "◎译 名 光环 第一季/光晕/光环世界/最后一战(台) ◎片 名 Halo Season 1 ◎年 代 2022 ◎产 地 美国 ◎类 别 动作/科幻/战争 ◎语 言 英语 ◎字 幕 中英双字 ◎上映日期 2022-03-24(美国) ◎IMDb评分 7.1/10 from 8368 users ◎豆瓣评分 7.3/10 from 3096 users ◎集",
  },
  {
    title: "2021主打美剧《假如…？ 第一季》更新第09集[中英双字]",
    link: "/html/tv/oumeitv/20210826/61781.html",
    date: "日期：2021-10-07 23:13:29",
    content:
      "◎译 名 假如？ 第一季/如果？/无限可能：假如..? ◎片 名 What If...? Season 1/Marvel's What If...?/What if ◎年 代 2021 ◎产 地 美国 ◎类 别 动作 / 动画 / 奇幻 / 冒险 ◎语 言 英语 ◎字 幕 中英双字 ◎上映日期 2021-08-11(美国) ◎IMDb评分7.6/10 from 1154",
  },
  {
    title: "2021主打美剧《行尸走肉 第十一季》更新第08集[中英双字]",
    link: "/html/tv/oumeitv/20210826/61780.html",
    date: "日期：2021-10-05 22:44:05",
    content:
      "◎译 名 行尸走肉 第十一季/TWD/行尸走肉最终季/阴尸路 ◎片 名 The Walking Dead Season 11 ◎年 代 2021 ◎产 地 美国 ◎类 别 剧情/惊悚/恐怖 ◎语 言 英语 ◎字 幕 中英双字 ◎上映日期 2021-08-15(美国网络) / 2021-08-22(美国) ◎IMDb评分8.9/10 from 3452 users",
  },
  {
    title: "2021年科幻动作《猎鹰与冬兵》更新第06集[中英双字]",
    link: "/html/tv/oumeitv/20210324/61245.html",
    date: "日期：2021-04-23 10:54:41",
    content:
      "◎译 名 猎鹰与冬兵/猎鹰与冬日战士 ◎片 名 The Falcon and the Winter Soldier/Falcon Winter Soldier ◎年 代 2021 ◎产 地 美国 ◎类 别 剧情 / 动作 / 科幻 / 冒险 ◎语 言 英语 ◎字 幕 中英双字 ◎上映日期 2021-03-19(美国) ◎IMDb评分8.3/10 from 9362 users",
  },
  {
    title: "2021年科幻动作《闪电侠 第七季》更新第11集[中英双字]",
    link: "/html/tv/oumeitv/20210306/61169.html",
    date: "日期：2021-05-28 22:09:14",
    content:
      "◎译 名 闪电侠第七季 ◎片 名 TheFlashSeason7 ◎年 代 2021 ◎产 地 美国 ◎类 别 剧情/动作/科幻/冒险 ◎语 言 英语 ◎字 幕 中英双字 ◎上映日期 2021-03-02(美国) ◎IMDb评分6.7/10from1149users ◎豆瓣评分 7.4/10from115users ◎导 演 亚历山德拉拉罗什Alexandr",
  },
  {
    title: "2020年高分惊悚《法官大人 第一季》更新第09集[中英双字]",
    link: "/html/tv/oumeitv/20201216/60851.html",
    date: "日期：2021-02-10 18:05:57",
    content:
      "法官大人,法官 第一季 中英双字 ◎译 名 法官大人/法官 第一季 ◎片 名 Your Honor ◎年 代 2020 ◎产 地 美国 ◎类 别 剧情/惊悚/犯罪 ◎语 言 英语 ◎字 幕 中英双字幕 ◎上映日期 2020-12-06(美国) ◎IMDb评分8.7/10 from 1946 users ◎豆瓣评分 9.1/10 from 924 use",
  },
  {
    title: "2020年动作《海豹突击队 第四季》更新第16集[中英双字]",
    link: "/html/tv/oumeitv/20201205/60799.html",
    date: "日期：2021-05-29 23:57:42",
    content:
      "海豹突击队 第四季 ◎译 名 海豹突击队 第四季 ◎片 名 SEAL Team Season 4 ◎年 代 2020 ◎产 地 美国 ◎类 别 剧情/动作/战争 ◎语 言 英语 ◎字 幕 中英双字幕 ◎上映日期 2020-12-02(美国) ◎IMDb评分8.8/10 from 69 users ◎片 长 43分钟 ◎导 演 克里斯托弗查莱克",
  },
  {
    title: "2020年科幻动作《曼达洛人 第二季》更新第08集[中英双字]",
    link: "/html/tv/oumeitv/20201101/60672.html",
    date: "日期：2020-12-19 23:52:22",
    content:
      "曼达洛人 第二季/星球大战：曼达洛人 ◎译 名 曼达洛人 第二季/星球大战：曼达洛人 ◎片 名 The Mandalorian Season 2/Star Wars: The Mandalorian ◎年 代 2020 ◎产 地 美国 ◎类 别 动作 / 科幻 / 冒险 ◎语 言 英语 ◎上映日期 2020-10-30(美国) ◎IMDb评分9.2/10 f",
  },
  {
    title: "2020年科幻《星际迷航：发现号 第三季》更新第12集[中英双字]",
    link: "/html/tv/oumeitv/20201019/60622.html",
    date: "日期：2021-01-08 17:44:48",
    content:
      "◎译 名 星际迷航：发现号 第三季/星空奇遇记：发现号(港)/星际争霸战：发现号(台)/星际迷航：探索号 ◎片 名 Star Trek: Discovery Season 3 ◎年 代 2020 ◎产 地 美国 ◎类 别 剧情/科幻/冒险 ◎语 言 英语 ◎字 幕 中英双字幕 ◎上映日期 2020-10-15(美国) ◎IMDb",
  },
  {
    title: "2020年动作《战士 第二季》更新第10集[中英双字]",
    link: "/html/tv/oumeitv/20201006/60575.html",
    date: "日期：2020-12-08 01:24:02",
    content:
      "战士 第二季/龙战士 第二季 ◎译 名 战士 第二季/龙战士 ◎片 名 Warrior Season 2 ◎年 代 2020 ◎产 地 美国 ◎类 别 剧情/动作/犯罪 ◎语 言 英语 ◎字 幕 中英双字幕 ◎上映日期 2020-10-02(美国) ◎IMDb评分8.9/10 from 116 users ◎豆瓣评分 9.2/10 from 181 user",
  },
  {
    title: "2020年科幻悬疑《恶魔之地 第一季》更新第10集[中英双字]",
    link: "/html/tv/oumeitv/20200826/60397.html",
    date: "日期：2020-10-20 00:29:36",
    content:
      "恶魔之地/恋伪镇惊逃(港)/洛夫克拉夫特之乡/逃出绝命村(台) ◎译 名 恶魔之地/恋伪镇惊逃(港)/洛夫克拉夫特之乡/逃出绝命村(台) ◎片 名 Lovecraft Country ◎年 代 2020 ◎产 地 美国 ◎类 别 剧情/科幻/悬疑/惊悚/恐怖/奇幻 ◎语 言 英语 ◎字 幕 中英双字幕 ◎上映",
  },
  {
    title: "2020主打美剧《神盾局特工 第七季》更新第12-13集[中英双字]剧终",
    link: "/html/tv/oumeitv/20200531/60079.html",
    date: "日期：2020-08-13 20:37:31",
    content:
      "◎译 名 神盾局特工 第七季 ◎片 名 Agents of S.H.I.E.L.D. Season 7 ◎年 代 2020 ◎产 地 美国 ◎类 别 剧情 / 动作 / 科幻 / 惊悚 / 冒险 ◎语 言 英语 ◎上映日期 2020-05-27(美国) ◎IMDb评分8.7/10 from 362 users ◎豆瓣评分 9.3/10 from 1,336 users ◎集 数",
  },
  {
    title: "2020主打美剧《西部世界 第三季》更新第08集[中英双字]",
    link: "/html/tv/oumeitv/20200317/59831.html",
    date: "日期：2020-05-05 22:06:03",
    content:
      "西部世界 第三季 ◎译 名 西部世界 第三季/西方极乐园 ◎片 名 Westworld Season 3 ◎年 代 2020 ◎产 地 美国 ◎类 别 剧情 / 科幻 / 悬疑 / 西部 ◎语 言 英语 ◎字 幕 中英双字幕 ◎上映日期 2020-03-15(美国) ◎IMDb评分 8.7/10 from 2,037 users ◎豆瓣评分 9.3/10",
  },
  {
    title: "2020主打美剧《国土安全 第八季》更新第12集[中英双字]剧终",
    link: "/html/tv/oumeitv/20200212/59712.html",
    date: "日期：2020-04-28 10:59:18",
    content:
      "国土安全 第八季 ◎译 名 国土安全 第八季/国土 ◎片 名 Homeland Season 8 ◎年 代 2020 ◎产 地 美国 ◎类 别 剧情 ◎语 言 英语 ◎字 幕 中英双字幕 ◎上映日期 2020-02-09(美国) ◎IMDb评分 8.3/10 from 194 users ◎豆瓣评分 9.7/10 from 540 users ◎集 数 12 ◎",
  },
  {
    title: "2020主打美剧《明日传奇 第五季》更新第15集[中英双字]",
    link: "/html/tv/oumeitv/20200119/59625.html",
    date: "日期：2020-06-04 12:00:13",
    content:
      "明日传奇 第五季 DC明日传奇 ◎译 名 明日传奇 第五季/DC明日传奇 ◎片 名 Legends of Tomorrow Season 5/DCs Legends of Tomorrow ◎年 代 2020 ◎产 地 美国 ◎类 别 剧情 / 动作 / 科幻 / 冒险 ◎语 言 英语 ◎上映日期 2020-01-21(美国) ◎集 数 15 ◎片 长 43分钟",
  },
  {
    title: "2020主打美剧《犯罪心理 第十五季》更新第09-10集[中英双字]剧终",
    link: "/html/tv/oumeitv/20200114/59608.html",
    date: "日期：2020-02-21 18:19:59",
    content:
      "犯罪心理 第十五季 ◎译 名 犯罪心理 第十五季 ◎片 名 Criminal Minds Season 15 ◎年 代 2020 ◎产 地 美国 ◎类 别 剧情 / 悬疑 / 犯罪 ◎语 言 英语 ◎上映日期 2020-01-08(美国) ◎IMDb评分 8.4/10 from 109 users ◎豆瓣评分 9.1/10 from 411 users ◎集 数 10 ◎",
  },
  {
    title: "2019主打美剧《守望者 第一季》更新第09集[中英双字]",
    link: "/html/tv/oumeitv/20191022/59287.html",
    date: "日期：2019-12-17 10:38:22",
    content:
      "守望者 第一季 / 保卫奇侠(港) / 守护者(台) ◎译 名 守望者 第一季 / 保卫奇侠(港) / 守护者(台) ◎片 名 Watchmen Season 1 ◎年 代 2019 ◎产 地 美国 ◎类 别 剧情 / 动作 / 奇幻 ◎语 言 英语 ◎上映日期 2019-10-20(美国) / 2019-10-21(英国) ◎IMDb评分 8.6/10",
  },
  {
    title: "2019主打美剧《绿箭侠 第八季》更新第10集[中英双字]",
    link: "/html/tv/oumeitv/20191017/59272.html",
    date: "日期：2020-01-30 22:38:22",
    content:
      "绿箭侠 第八季 / 箭神(港) / 绿箭 ◎译 名 绿箭侠 第八季 / 箭神(港) / 绿箭 ◎片 名 Arrow Season 8 / Green Arrow ◎年 代 2019 ◎产 地 美国 ◎类 别 剧情 / 动作 / 科幻 / 悬疑 / 犯罪 / 冒险 ◎语 言 英语 ◎上映日期 2019-10-15(美国) ◎IMDb评分 9.6/10 from 582",
  },
  {
    title: "2019主打美剧《邪恶力量/凶鬼恶灵 第十五季》更新第20集[中英双字]剧终",
    link: "/html/tv/oumeitv/20191012/59250.html",
    date: "日期：2020-11-21 20:25:09",
    content:
      "邪恶力量 第十五季 / 超自然 凶鬼恶灵 ◎译 名 邪恶力量 第十五季 / 超自然 凶鬼恶灵 ◎片 名 Supernatural Season 15 ◎年 代 2019 ◎产 地 美国 ◎类 别 剧情 / 惊悚 / 奇幻 / 冒险 ◎语 言 英语 ◎上映日期 2019-10-10(美国) ◎IMDb评分 9.6/10 from 178 users ◎集",
  },
  {
    title: "2019主打美剧《闪电侠 第六季》更新第19集[中英双字]",
    link: "/html/tv/oumeitv/20191010/59244.html",
    date: "日期：2020-05-15 10:14:17",
    content:
      "闪电侠 第六季 ◎译 名 闪电侠 第六季 ◎片 名 The Flash Season 6 ◎年 代 2019 ◎产 地 美国 ◎类 别 剧情/动作/科幻 ◎语 言 英语 ◎上映日期 2019-10-08(美国) ◎IMDb评分 8.4/10 from 458 users ◎集 数 23 ◎片 长 40分钟 ◎导 演 大卫努特尔 David Nutter ◎编",
  },
];
