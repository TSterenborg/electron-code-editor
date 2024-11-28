const folderTemplate = (name) => `
    <div class="flex h-[25px] w-full cursor-pointer items-center hover:bg-fill_primary_hover">
        <span class="ml-[12px] flex h-full w-[24px] items-center justify-center font-segoefluenticons text-[10px]">&#xe970;</span>
        <span class="flex h-full w-[24px] items-center justify-center font-segoefluenticons text-[14px]">&#xe8d5;</span>
        <span class="flex h-full items-center px-[8px] text-[14px]">${name}</span>
    </div>
`;

const fileTemplate = (name) => `
    <div class="flex h-[25px] w-full cursor-pointer items-center hover:bg-fill_primary_hover">
        <span class="invisible ml-[12px] flex h-full w-[24px] items-center justify-center font-segoefluenticons text-[10px]">&#xe970;</span>
        <span class="flex h-full w-[24px] items-center justify-center font-segoefluenticons text-[14px]">&#xe8a5;</span>
        <span class="flex h-full items-center px-[8px] text-[14px]">${name}</span>
    </div>
`;