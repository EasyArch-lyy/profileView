import moment from 'moment';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!');  // eslint-disable-line
  }
  // const arr1 = str1.split('/');
  // const arr2 = str2.split('/');
  // if (arr2.every((item, index) => item === arr1[index])) {
  //   return 1;
  // } else if (arr1.every((item, index) => item === arr2[index])) {
  //   return 2;
  // }
  return 3;
}

// 转formData格式数据
export function toFormData(params = {}) {
  const formData = new FormData();
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      formData.append(key, params[key]);
    }
  }
  return formData;
}

function commonBinarySearch(arr, key) {
  let low = 0;
  let high = arr.length - 1;
  let middle = 0;

  if (key < arr[low].case_id || key > arr[high].case_id || low > high) {
    return -1;
  }

  while (low <= high) {
    middle = parseInt((low + high) / 2, 10);
    if (arr[middle].case_id > key) {
      // 比关键字大则关键字在左区域
      high = middle - 1;
    } else if (arr[middle].case_id < key) {
      // 比关键字小则关键字在右区域
      low = middle + 1;
    } else {
      return middle;
    }
  }

  return -1;
}

function updateTree(branch = {}, caseDutyPersonList) {
  let lastResult = false;
  // branch.checkbox = 'none';
  if (branch.type === -1 && caseDutyPersonList.length > 0) {
    const index = commonBinarySearch(caseDutyPersonList, branch.id);
    if (index !== -1) {
      if (branch.id === caseDutyPersonList[index].case_id) {
        // branch.allotted = true;
        branch.allotPerson = caseDutyPersonList[index].duty_person;
        return true;
      }
    }
  } else if (branch.children) {
    branch.children.forEach((item) => {
      item.checkbox = 'none';
      const result = updateTree(item, caseDutyPersonList);
      if (result) {
        // item.allotted = true;
        lastResult = true;
      }
    });
  }
  return lastResult;
}

// 树结构添加分配的责任人
export function taskCaseDutyPersons(data, caseDutyPersonList) {
  data.forEach((item) => {
    // item.checkbox = 'none';
    updateTree(item, caseDutyPersonList);
    // if (result) {
    //   item.allotted = true;
    // }
  });

  return data;
}

export function changeCaseTree(response, record = {}, data) {
  let payload = deleteCaseChildren(response, record);
  if (record.id) {
    const CaseTree = JSON.stringify(data); // 此处原来代码是this.props.CassTree
    const R = {
      ...record,
      children: JSON.parse(payload),
    };
    const oldR = JSON.stringify(record);
    const newR = JSON.stringify(R);
    payload = CaseTree.replace(oldR, newR);
  }

  return payload;
}

function deleteCaseChildren(response, parentRecord) {
  const data = [];
  const { parent: p, type, id } = parentRecord;
  let parent = { [type]: id };
  if (p) parent = { ...p, ...parent };
  JSON.parse(response).forEach((element) => {
    if (element.children.length <= 0 && element.type > 0) data.push(element);
    else if (element.type > 0) {
      const children = deleteCaseChildren(JSON.stringify(element.children), { ...element, parent });
      data.push({ ...element, children: JSON.parse(children), parent });
    } else {
      const child = { ...element, parent };
      delete child.children;
      data.push(child);
    }
  });
  return JSON.stringify(data);
}

export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path);
  routes = routes.map(item => item.replace(path, ''));
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      key: `${path}${item}`,
      path: `${path}${item}`,
      component: routerData[`${path}${item}`].component,
      authority: routerData[`${path}${item}`].authority,
      exact,
    };
  });
  return renderRoutes;
}
