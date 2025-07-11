function toggleShiftFields(shift) {
    const checkbox = document.getElementById(`shift-${shift}`);
    const field = document.getElementById(`shift-${shift}-fields`);
    field.style.display = checkbox.checked ? 'block' : 'none';
}

function generateRoster(shift) {
    const station = document.getElementById('station').value.trim();
    const month = document.getElementById('month').value.trim();
    const day = document.getElementById('day').value.trim();

    if (!station || !month || !day) {
        alert("请填写站点名称和完整日期！");
        return;
    }

    const labelMap = { morning: '早班', afternoon: '中班', evening: '晚班' };

    const time = document.getElementById(`${shift}-time`).value.trim();

    const countStr = document.getElementById(`${shift}-count`).value.trim();
    if (!countStr || isNaN(countStr)) {
        alert("请输入有效人数！");
        return;
    }
    const count = parseInt(countStr);

    // 读取统一报名截止时间
    const applyMonth = document.getElementById('apply-month').value.trim();
    const applyDay = document.getElementById('apply-day').value.trim();
    const applyTime = document.getElementById('apply-time').value.trim();

    if (!applyMonth || !applyDay || !applyTime) {
        alert("请填写完整的报名截止时间！");
        return;
    }

    const date = `${month}月${day}日`;
    const label = labelMap[shift];

    let output = `#接龙 【${date} ${station}站 ${label}（${time}）：${count}人】\n第一条记录是示例，请勿删除。\n`;
    output += `截止时间：${applyMonth}月${applyDay}日 ${applyTime}\n\n`;

    // 只生成一条示例，不循环
    output += `1.${date}${label} 姓名 性别 学号 手机号\n`;

    document.getElementById(`roster-${shift}`).value = output.trim();
}

function copyRoster(shift) {
    const text = document.getElementById(`roster-${shift}`).value;
    if (!text) {
        alert("请先生成接龙！");
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert("接龙已复制！");
        }).catch(err => {
            fallbackCopyText(text);
        });
    } else {
        fallbackCopyText(text);
    }
}

function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert("文本已复制！");
        } else {
            alert("复制失败，请手动复制。");
        }
    } catch (err) {
        alert("复制失败，请手动复制。");
    }
    document.body.removeChild(textarea);
}

function generateAnnouncement() {
    const station = document.getElementById('station').value.trim();
    const month = document.getElementById('month').value.trim();
    const day = document.getElementById('day').value.trim();

    const applyMonth = document.getElementById('apply-month').value.trim();
    const applyDay = document.getElementById('apply-day').value.trim();
    const applyTime = document.getElementById('apply-time').value.trim();

    if (!station || !month || !day) {
        alert("请填写站点名称和完整日期！");
        return;
    }
    if (!applyMonth || !applyDay || !applyTime) {
        alert("请填写完整的报名截止时间！");
        return;
    }

    function getCount(shift) {
        const checkbox = document.getElementById(`shift-${shift}`);
        if (!checkbox.checked) return 0;
        const val = document.getElementById(`${shift}-count`).value.trim();
        return val && !isNaN(val) ? parseInt(val) : 0;
    }

    function getTime(shift, defaultTime) {
        const checkbox = document.getElementById(`shift-${shift}`);
        if (!checkbox.checked) return '';
        const val = document.getElementById(`${shift}-time`).value.trim();
        return val || defaultTime;
    }

    const morningCount = getCount('morning');
    const afternoonCount = getCount('afternoon');
    const eveningCount = getCount('evening');

    const morningTime = getTime('morning', '8:00-14:00');
    const afternoonTime = getTime('afternoon', '14:00-20:00');
    const eveningTime = getTime('evening', '16:00-21:00');

    let shiftsDisplay = [];
    if (morningCount > 0) shiftsDisplay.push(`早班${morningTime}（${morningCount}人）`);
    if (afternoonCount > 0) shiftsDisplay.push(`中班${afternoonTime}（${afternoonCount}人）`);
    if (eveningCount > 0) shiftsDisplay.push(`晚班${eveningTime}（${eveningCount}人）`);
    if (shiftsDisplay.length === 0) shiftsDisplay.push('无');

    const announcement = `各位同学们：
大家好，现开始开展地铁志愿者招募活动。以下是相关信息说明：
1.服务站点：${station}站
2.服务日期：${month}月${day}日，请大家务必注意服务日期！
3.主要服务：负责站内指引、维持秩序等工作
4.具体站点人员需求及服务时间安排：${shiftsDisplay.join('/')}
5.报名时间：${applyMonth}月${applyDay}日 ${applyTime}
6.报名方式：报名时间开始后会在群内发布接龙，采用先到先得的方式录取，当接龙人数达到站点所需人数时即为停止招募。
7.服务要求：
在志愿服务过程中，需耐心有礼，面带微笑。劝导乘客时注意文明礼貌，避免与乘客发生冲突，出现有投诉、纠纷的情况时一定要就近向工作人员求助，一定以保障自身安全为主开展志愿服务活动。
（1）❗请参加志愿服务的同学注意着装，可以穿长裤、西裤、休闲裤，不要穿短裙短裤；
（2）❗请女生请将过肩长发扎起，男生不得弄大背头。考虑服务对象为广州市民及游客，志愿者若有刺青、纹身等请尽量遮挡（暴露在着装外、夸张发色的不予录用）；
（3）服务站点将提供统一穿戴的志愿者马甲；
（4）在岗期间，不要在公共区使用手机，有急事可以跟车站说明以后进设备区使用。
8.其他事项
报名成功的同学，请带好自己的学生证或身份证以方便志愿服务站点确认身份。考勤听从相应服务站点工作人员安排，志愿者每天上岗前及上岗结束后需在志愿者签到本或者坐台本上签到、签退。
服务地点即所报名志愿服务的地铁站内。达到各站点后，取得联系方式如下：一是到报名服务的地铁站点后，找到站点的车站控制室（简称车控室），告知工作人员自身身份，出示志愿者证或学生证并说明来意；二是通过班级群发布的招募信息的工作人员联系方式，并取得联系。三是与站点巡逻工作人员取得联系，告知工作人员自身身份，出示志愿者证或学生证，说明来意。如未遵循着装及服务要求，地铁将不予安排上岗。
请确保报名后能参与活动。如有其他疑问，可在群内向老师和助教询问。确认录用后请在周六之前请假，周六之后请假同学将暂停1次地铁项目招募，无故缺席志愿服务的本项目将不再录用。`;

    document.getElementById('announcement').value = announcement;
}

function copyAnnouncement() {
    const text = document.getElementById('announcement').value;
    if (!text) {
        alert("请先生成群公告！");
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert("群公告已复制！");
        }).catch(err => {
            fallbackCopyText(text);
        });
    } else {
        fallbackCopyText(text);
    }
}