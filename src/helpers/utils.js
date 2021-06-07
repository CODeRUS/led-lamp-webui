export const title = (string) => {
  const titles = {
    n: 'Name',
    b: 'Brightness',
    s: 'Speed',
    l: 'Scale',
    i: 'Id',
  }
  let title = string in titles ? titles[string] : string
  return title.charAt(0).toUpperCase() + title.slice(1)
}

export const HEXToRGBColor = (hexString) => {
  const bigint = parseInt(hexString.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

export const RGBColorToHEX = ({r, g, b}) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
